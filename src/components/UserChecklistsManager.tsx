import React from 'react';
import { IonSplitPane } from '@ionic/react';
import ChecklistSummaryList from './ChecklistSummaryList';
import { getChecklistSummaries, userChecklists, createNewStoneChecklist } from '../util/user-checklists';
import ChecklistPage from '../pages/ChecklistPage';
import { StoneChecklist } from '../declarations';
import firebase from 'firebase/app';
import 'firebase/firestore';

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
        this.state = {userChecklists: userChecklists, activeChecklistId: userChecklists[0].checklistId};
        db = props.firebaseApp.firestore();
    }

    private updateStoneListData = (checklistToUpdateId: string, callerName: string, updateFunc: (existingChecklist: StoneChecklist) => StoneChecklist) => {
        this.setState(({userChecklists}) => {

            const listToUpdateIndex = userChecklists.findIndex(checklist => checklist.checklistId === checklistToUpdateId);
            if (listToUpdateIndex === -1) {
                console.error(`${callerName}() invalid checklistId: ${checklistToUpdateId}`);
                return {userChecklists: userChecklists};
            }
            const curList = userChecklists[listToUpdateIndex];
            
            const newList: StoneChecklist = updateFunc(curList);
            
            const newChecklists = [...userChecklists];
            newChecklists[listToUpdateIndex] = newList;
            
            if (this.props.firebaseApp.auth().currentUser != null){
                newChecklists.forEach(list => {
                    db.collection('users').doc((this.props.firebaseApp.auth().currentUser as firebase.User).uid).collection('checklists').add(list);
                });
            }
            return {userChecklists: newChecklists};
        });
    }

    toggleStoneFoundStatus = (checklistId: string, stoneId: number) => {
        this.updateStoneListData(checklistId, 'toggleStoneFoundStatus', (curList: StoneChecklist) => {
                return {
                    ...curList, 
                    stoneLocations: curList.stoneLocations.map(stonLoc => {
                        if (stonLoc.stoneId === stoneId) {
                            return {...stonLoc, isFound: !stonLoc.isFound};
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
        this.setState((state: UserChecklistManagerState) => {
            const newChecklists = [...state.userChecklists, newChecklist];
            return {userChecklists: newChecklists, activeChecklistId: newChecklist.checklistId};
        });
    }

    activateChecklist = (checklistId: string) => {
        this.setState((state) => {
            if (checklistId != null && state.userChecklists.some(c => c.checklistId === checklistId)) {
                return {activeChecklistId: checklistId};
            } else {
                return {activeChecklistId: state.activeChecklistId};
            }
        })
    }

    deleteChecklist = (checklistId: string) => {
        this.setState((state) => {
            const deletedChecklistIndex = state.userChecklists.findIndex(c => c.checklistId === checklistId);
            const updatedChecklistsList = state.userChecklists;
            if (deletedChecklistIndex !== -1) {
                updatedChecklistsList.splice(deletedChecklistIndex, 1);
            }

            let updatedState: any = {userChecklists: updatedChecklistsList};
            if (state.activeChecklistId === checklistId) {
                updatedState.activeChecklistId = updatedChecklistsList[0].checklistId;
            } 
            return updatedState;
        })
    }

    render() {
        return (
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
                    toggleStoneFoundStatus={(stoneId: number) => {this.toggleStoneFoundStatus(this.state.activeChecklistId, stoneId)}}
                    updateChecklistName={(newChecklistName: string) => {this.updateChecklistName(this.state.activeChecklistId, newChecklistName)}}
                    toggleHideCompletedStones={() => {this.toggleHideCompletedStones(this.state.activeChecklistId)}}
                    />
            </IonSplitPane>
        )
    }
}

export default UserChecklistsManager;