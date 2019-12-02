import React from 'react';
import { IonApp, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { StoneChecklist } from './declarations';
import ChecklistSummaryList from './components/ChecklistSummaryList';
import { userChecklists, getChecklistSummaries, createNewStoneChecklist } from './util/user-checklists';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import ChecklistPage from './pages/ChecklistPage';

interface BtrAppState {
    userChecklists: StoneChecklist[];
    activeChecklistId: string;
}

class BtrApp extends React.Component<any, BtrAppState> {
    constructor(props: any) {
        super(props);
        this.state = {userChecklists: userChecklists, activeChecklistId: userChecklists[0].checklistId};
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
        this.setState((state: BtrAppState) => {
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
            <IonApp>
                <IonReactRouter>
                    <IonSplitPane contentId="main">
                        <ChecklistSummaryList
                            checklistSummaries={getChecklistSummaries(this.state.userChecklists)}
                            activeChecklistId={this.state.activeChecklistId}
                            addNewChecklist={this.addNewChecklist}
                            activateChecklist={this.activateChecklist}
                            deleteChecklist={this.deleteChecklist}
                        />
                        <ChecklistPage
                            pageElemId="main"
                            checklist={this.state.userChecklists.find(c => c.checklistId === this.state.activeChecklistId) || this.state.userChecklists[0]}
                            toggleStoneFoundStatus={(stoneId: number) => {this.toggleStoneFoundStatus(this.state.activeChecklistId, stoneId)}}
                            updateChecklistName={(newChecklistName: string) => {this.updateChecklistName(this.state.activeChecklistId, newChecklistName)}}
                            toggleHideCompletedStones={() => {this.toggleHideCompletedStones(this.state.activeChecklistId)}}
                        />
                    </IonSplitPane>
                </IonReactRouter>
            </IonApp>
        );
    }
};

export default BtrApp;
