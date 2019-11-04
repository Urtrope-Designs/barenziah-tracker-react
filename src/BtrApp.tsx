import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { ChecklistSummary, StoneChecklist } from './declarations';
import ChecklistSummaryList from './components/ChecklistSummaryList';
import { STONE_LIST } from './util/stone-list';
import ChecklistPageResolver from './pages/ChecklistPageResolver';
import { userChecklistsMap } from './util/user-checklists-map';

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

function getChecklistSummaries(checklistsMap: Map<string, StoneChecklist>): ChecklistSummary[] {
    const summaries: ChecklistSummary[] = [];
    checklistsMap.forEach((checklist, checklistId) => {
        const checklistSummary: ChecklistSummary = {
            checklistId,
            checklistName: checklist.checklistName,
            numStonesToFind: STONE_LIST.length - checklist.stoneLocations.reduce<number>((total, curStonLoc) => curStonLoc.isFound ? ++total : total, 0),
        };
        summaries.push(checklistSummary);
    });
    return summaries;
};

interface BtrAppState {
    userChecklistsMap: Map<string, StoneChecklist>;
}

class BtrApp extends React.Component<any, BtrAppState> {
    constructor(props: any) {
        super(props);
        this.state = {userChecklistsMap: userChecklistsMap};
    }

    toggleStoneFoundStatus = (checklistId: string, stoneId: number) => {
        this.setState((state: BtrAppState) => {
            const curList = state.userChecklistsMap.get(checklistId);
            if (!curList) {
                console.error(`toggleStoneFoundStatus() invalid checklistId: ${checklistId}`);
                return;
            }

            const newList: StoneChecklist = {
                checklistName: curList.checklistName,
                stoneLocations: curList.stoneLocations.map(stonLoc => {
                    if (stonLoc.stoneId === stoneId) {
                        return {...stonLoc, isFound: !stonLoc.isFound};
                    } else {
                        return {...stonLoc}
                    }
                })
            }

            const newChecklistsMap = new Map(state.userChecklistsMap);
            newChecklistsMap.set(checklistId, newList);
            
            return {...state, userChecklistsMap: newChecklistsMap};
        });
    }

    render() {
        return (
            <IonApp>
                <IonReactRouter>
                    <IonSplitPane contentId="main">
                        <ChecklistSummaryList checklistSummaries={getChecklistSummaries(this.state.userChecklistsMap)} />
                        <IonRouterOutlet id="main">
                            <Route
                                path="/checklist/:checklistId"
                                render={(props) => {
                                    return <ChecklistPageResolver {...props} userChecklistsMap={this.state.userChecklistsMap} toggleStoneFoundStatus={this.toggleStoneFoundStatus} />
                                }}
                                exact={true}
                            />
                            <Route path="/" render={() => <Redirect to={'/checklist/' + userChecklistsMap.keys().next().value} exact={true} />} />
                        </IonRouterOutlet>
                    </IonSplitPane>
                </IonReactRouter>
            </IonApp>
        );
    }
};

export default BtrApp;
