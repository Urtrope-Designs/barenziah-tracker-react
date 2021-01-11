import React from 'react';
import { IonSplitPane } from '@ionic/react';
import ChecklistSummaryList from './ChecklistSummaryList';
import { getChecklistSummaries, createNewStoneChecklist } from '../util/user-checklists';
import ChecklistPage from '../pages/ChecklistPage';
import { StoneChecklist } from '../declarations';
import firebase from 'firebase/app';
import 'firebase/firestore';
import FullPageLoader from './FullPageLoader';

let db: firebase.firestore.Firestore;

interface UserChecklistManagerProps {
    logOutClicked(): any;
    firebaseApp: firebase.app.App;
    userId: string;
}

interface UserChecklistManagerState {
    userChecklists: StoneChecklist[];
    activeChecklistId: string;
}

class UserChecklistsManager extends React.Component<UserChecklistManagerProps, UserChecklistManagerState> {
    constructor(props: any) {
        super(props);
        db = props.firebaseApp.firestore();
        db.collection('users').doc((this.props.firebaseApp.auth().currentUser as firebase.User).uid).collection('checklists').onSnapshot(querySnapshot => {
            if (querySnapshot.size < 1) {
                this.addNewChecklist('Untitled');
            } else {
                this.setState({userChecklists: querySnapshot.docs.map(this.hydrateChecklistFromFB)});
            }
        });
        db.collection('users').doc((this.props.firebaseApp.auth().currentUser as firebase.User).uid).onSnapshot(querySnapshot => {
            const queryData = querySnapshot.data();
            if (queryData !== undefined) {
                this.setState({activeChecklistId: queryData.activeChecklistId});
            }
        });
    }

    private updateStoneListData = (checklistToUpdateId: string, callerName: string, updateFunc: (existingChecklist: StoneChecklist) => StoneChecklist) => {
        this.setState(({userChecklists}) => {
            const listToUpdate = userChecklists.find(checklist => checklist.checklistId === checklistToUpdateId);
            if (listToUpdate == null) {
                console.error(`${callerName}() invalid checklistId: ${checklistToUpdateId}`);
                return {userChecklists: userChecklists};
            }

            const newList: StoneChecklist = updateFunc(listToUpdate);

            const userDoc = db.collection('users').doc((this.props.firebaseApp.auth().currentUser as firebase.User).uid);
            userDoc.collection('checklists').doc(checklistToUpdateId).set(newList);

            return null;
        });
    }

    setStoneFoundStatus = (checklistId: string, stoneId: number, value: boolean) => {
        this.updateStoneListData(checklistId, 'setStoneFoundStatus', (curList: StoneChecklist) => {
                return {
                    ...curList, 
                    stoneLocations: curList.stoneLocations.map(stonLoc => {
                        if (stonLoc.stoneId === stoneId) {
                            return {...stonLoc, isFound: value};
                        } else {
                            return {...stonLoc}
                        }
                    })
                }
            });
    }

    updateChecklistName = (checklistId: string, newChecklistname: string) => {
        this.updateStoneListData(checklistId, 'updateChecklistName', (curList: StoneChecklist) => {
                return {
                    ...curList,
                    checklistName: newChecklistname,
                }
            });
    }

    toggleHideCompletedStones = (checklistId: string) => {
        this.updateStoneListData(checklistId, 'toggleHideCompletedStones', (curList: StoneChecklist) => {
                return {
                    ...curList,
                    hideCompletedStones: !curList.hideCompletedStones,
                }
            });
    }

    addNewChecklist = (newChecklistName: string) => {
        const newChecklist: StoneChecklist = createNewStoneChecklist(newChecklistName);
        db.collection('users').doc((this.props.firebaseApp.auth().currentUser as firebase.User).uid).collection('checklists').add(newChecklist).then((docRef) => {
            db.collection('users').doc((this.props.firebaseApp.auth().currentUser as firebase.User).uid).set({
                activeChecklistId: docRef.id
            });
        });
    }

    activateChecklist = (checklistId: string) => {
        this.setState((state) => {
            if (checklistId != null && state.userChecklists.some(c => c.checklistId === checklistId)) {
                db.collection('users').doc((this.props.firebaseApp.auth().currentUser as firebase.User).uid).set({
                    activeChecklistId: checklistId
                });
            } 
            return null;
        })
    }

    deleteChecklist = (checklistId: string) => {
        this.setState((state) => {
            const userDoc = db.collection('users').doc((this.props.firebaseApp.auth().currentUser as firebase.User).uid);
            userDoc.collection('checklists').doc(checklistId).delete().then(() => {
                if (state.activeChecklistId === checklistId && state.userChecklists.length > 1) {
                    const firstChecklistId = state.userChecklists[0].checklistId;
                    this.activateChecklist(firstChecklistId === checklistId ? state.userChecklists[1].checklistId : firstChecklistId);
                } 
            });

            return null;
        })
    }

    hydrateChecklistFromFB(fbChecklistDoc: firebase.firestore.QueryDocumentSnapshot): StoneChecklist {
        const extractedChecklist: StoneChecklist = {...(fbChecklistDoc.data() as StoneChecklist)};
        extractedChecklist.checklistId = fbChecklistDoc.id;
        return extractedChecklist;
    }

    render() {
        return this.state == null ? (
            <FullPageLoader message={'Uno Momento'}></FullPageLoader>
        )
        : (
            <IonSplitPane contentId="main">
                <ChecklistSummaryList
                    checklistSummaries={getChecklistSummaries(this.state.userChecklists)}
                    activeChecklistId={this.state.activeChecklistId}
                    addNewChecklist={this.addNewChecklist}
                    activateChecklist={this.activateChecklist}
                    deleteChecklist={this.deleteChecklist}
                    logOutClicked={this.props.logOutClicked}
                    />
                <ChecklistPage
                    pageElemId="main"
                    checklist={this.state.userChecklists.find(c => c.checklistId === this.state.activeChecklistId) || this.state.userChecklists[0]}
                    setStoneFoundStatus={(stoneId: number, value: boolean) => {this.setStoneFoundStatus(this.state.activeChecklistId, stoneId, value)}}
                    updateChecklistName={(newChecklistName: string) => {this.updateChecklistName(this.state.activeChecklistId, newChecklistName)}}
                    toggleHideCompletedStones={() => {this.toggleHideCompletedStones(this.state.activeChecklistId)}}
                    />
            </IonSplitPane>
        )
    }
}

export default UserChecklistsManager;