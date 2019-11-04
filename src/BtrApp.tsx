import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { ChecklistSummary, StoneChecklist } from './declarations';
import ChecklistSummaryList from './components/ChecklistSummaryList';
import { STONE_LIST } from './util/stone-list';
import ChecklistPageResolver from './pages/ChecklistPageResolver';
import { userChecklists } from './util/user-checklists-map';

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

function getChecklistSummaries(checklists: StoneChecklist[]): ChecklistSummary[] {
     const summaries = checklists.map(checklist => {
        const checklistSummary: ChecklistSummary = {
            checklistId: checklist.checklistId,
            checklistName: checklist.checklistName,
            numStonesToFind: STONE_LIST.length - checklist.stoneLocations.reduce<number>((total, curStonLoc) => curStonLoc.isFound ? ++total : total, 0),
        };
        return checklistSummary
    });
    return summaries;
};

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
            
            return {...state, userChecklists: newChecklists};
        });
    }

    render() {
        return (
            <IonApp>
                <IonReactRouter>
                    <IonSplitPane contentId="main">
                        <ChecklistSummaryList checklistSummaries={getChecklistSummaries(this.state.userChecklists)} />
                        <IonRouterOutlet id="main">
                            <Route
                                path="/checklist/:checklistId"
                                render={(props) => {
                                    return <ChecklistPageResolver {...props} userChecklists={this.state.userChecklists} toggleStoneFoundStatus={this.toggleStoneFoundStatus} />
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
