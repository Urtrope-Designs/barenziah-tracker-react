import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { StoneChecklist } from './declarations';
import ChecklistSummaryList from './components/ChecklistSummaryList';
import ChecklistPageResolver from './pages/ChecklistPageResolver';
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

interface BtrAppState {
    userChecklists: StoneChecklist[];
}

class BtrApp extends React.Component<any, BtrAppState> {
    constructor(props: any) {
        super(props);
        this.state = {userChecklists: userChecklists};
    }

    toggleStoneFoundStatus = (checklistId: string, stoneId: number) => {
        this.setState((state: BtrAppState) => {
            const curListIndex = state.userChecklists.findIndex(checklist => checklist.checklistId === checklistId);
            if (curListIndex === -1) {
                console.error(`toggleStoneFoundStatus() invalid checklistId: ${checklistId}`);
                return;
            }
            const curList = state.userChecklists[curListIndex];

            const newList: StoneChecklist = {
                checklistId: checklistId,
                checklistName: curList.checklistName,
                stoneLocations: curList.stoneLocations.map(stonLoc => {
                    if (stonLoc.stoneId === stoneId) {
                        return {...stonLoc, isFound: !stonLoc.isFound};
                    } else {
                        return {...stonLoc}
                    }
                })
            }

            const newChecklists = [...state.userChecklists];
            newChecklists[curListIndex] = newList;
            
            return {userChecklists: newChecklists};
        });
    }

    updateChecklistName = (checklistId: string, newChecklistname: string) => {
        this.setState((state: BtrAppState) => {
            const curListIndex = state.userChecklists.findIndex(checklist => checklist.checklistId === checklistId);
            if (curListIndex === -1) {
                console.error(`toggleStoneFoundStatus() invalid checklistId: ${checklistId}`);
                return;
            }
            const curList = state.userChecklists[curListIndex];

            const newList: StoneChecklist = {
                checklistId: checklistId,
                checklistName: newChecklistname,
                stoneLocations: curList.stoneLocations,
            }

            const newChecklists = [...state.userChecklists];
            newChecklists[curListIndex] = newList;
            
            return {userChecklists: newChecklists};
        });
    }

    addNewChecklist = (newChecklistName: string, navCallback?: (checklist: StoneChecklist) => any) => {
        const newChecklist: StoneChecklist = createNewStoneChecklist(newChecklistName);
        this.setState((state: BtrAppState) => {
            const newChecklists = [...state.userChecklists, newChecklist];
            return {userChecklists: newChecklists};
        });
        if (!!navCallback) {
            navCallback(newChecklist);
        }
    }

    render() {
        return (
            <IonApp>
                <IonReactRouter>
                    <IonSplitPane contentId="main">
                        <ChecklistSummaryList checklistSummaries={getChecklistSummaries(this.state.userChecklists)} addNewChecklist={this.addNewChecklist} />
                        <IonRouterOutlet id="main">
                            <Route
                                path="/checklist/:checklistId"
                                render={(props) => {
                                    return (
                                        <ChecklistPageResolver
                                            {...props}
                                            userChecklists={this.state.userChecklists}
                                            toggleStoneFoundStatus={this.toggleStoneFoundStatus}
                                            updateChecklistName={this.updateChecklistName}
                                        />
                                    )
                                }}
                                exact={true}
                            />
                            <Route path="/" render={() => <Redirect to={'/checklist/' + userChecklists[0].checklistId} exact={true} />} />
                        </IonRouterOutlet>
                    </IonSplitPane>
                </IonReactRouter>
            </IonApp>
        );
    }
};

export default BtrApp;
