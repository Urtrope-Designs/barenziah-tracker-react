import { IonModal, IonSplitPane } from "@ionic/react";
import { Storage } from '@ionic/storage';
import { useCallback, useEffect, useState } from "react";
import { StoneChecklist } from "../declarations";
import ChecklistPage from "../pages/ChecklistPage";
import { createNewStoneChecklist, getChecklistSummaries } from "../util/user-checklists";
import ChecklistSummaryList from "./ChecklistSummaryList";
import FullPageLoader from "./FullPageLoader";
import { About } from "./About";

interface LocalUserChecklistsManagerProps { 
    checklists: StoneChecklist[];
    activeChecklistId: string | null;
    startSyncingClicked(): any;
}

export const LocalUserChecklistsManager: React.FC<LocalUserChecklistsManagerProps> = (props) => {
    const [userChecklists, setUserChecklists] = useState<StoneChecklist[]>(props.checklists ?? []);
    const [activeChecklistId, setActiveChecklistId] = useState<string | null>(props.activeChecklistId);
    const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

    const addNewChecklist = useCallback((newChecklistName: string) => {
        let newChecklistId: string;
        do {
            newChecklistId = Math.random().toString(36).substring(2);
        } while (userChecklists.some(c => c.checklistId === newChecklistId));

        const newChecklist: StoneChecklist = createNewStoneChecklist(newChecklistName, newChecklistId);

        setUserChecklists([...userChecklists, newChecklist]);
        setActiveChecklistId(newChecklist.checklistId);
    }, [userChecklists]);

    const activateChecklist = (checklistId: string) => {
        if (checklistId != null && userChecklists.some(c => c.checklistId === checklistId)) {
            setActiveChecklistId(checklistId);
        }
    }

    const deleteChecklist = (checklistId: string) => {
        const remainingChecklists = userChecklists.filter(c => c.checklistId !== checklistId);
        setUserChecklists(remainingChecklists);
        if (activeChecklistId === checklistId) {
            setActiveChecklistId(remainingChecklists[0]?.checklistId);
        }
    }

    const updateStoneListData = (checklistToUpdateId: string, callerName: string, updateFunc: (existingChecklist: StoneChecklist) => StoneChecklist) => {
        const listToUpdate = userChecklists.find(checklist => checklist.checklistId === checklistToUpdateId);
        if (listToUpdate == null) {
            console.error(`${callerName}() invalid checklistId: ${checklistToUpdateId}`);
        } else {
            const updatedChecklist: StoneChecklist = updateFunc(listToUpdate);
            setUserChecklists(userChecklists.map(c => c.checklistId === checklistToUpdateId ? updatedChecklist : c));
        };
    }

    const setStoneFoundStatus = (checklistId: string, stoneId: number, value: boolean) => {
        updateStoneListData(checklistId, 'setStoneFoundStatus', (checklist: StoneChecklist) => {
            const updatedStones = checklist.stoneLocations.map(s => s.stoneId === stoneId ? {...s, isFound: value} : s);
            return {...checklist, stoneLocations: updatedStones};
        });
    }

    const updateChecklistName = (checklistId: string, newChecklistName: string) => {
        updateStoneListData(checklistId, 'updateChecklistName', (checklist: StoneChecklist) => {
            return {...checklist, checklistName: newChecklistName};
        });
    }

    const toggleHideCompletedStones = (checklistId: string) => {
        updateStoneListData(checklistId, 'toggleHideCompletedStones', (checklist: StoneChecklist) => {
            return {...checklist, hideCompletedStones: !checklist.hideCompletedStones};
        });
    }

    useEffect(() => {
        if (userChecklists.length === 0) {
            addNewChecklist('Untitled');
        }

        const store = new Storage();
        store.create()
            .then(() => store.set('checklists', userChecklists));
    }, [userChecklists, addNewChecklist]);
    
    useEffect(() => {
        if(activeChecklistId === null) {
            return;
        }

        const store = new Storage();
        store.create()
            .then(() => store.set('activeChecklistId', activeChecklistId));
    }, [activeChecklistId]);

    return userChecklists === null || activeChecklistId === null ? (
        <FullPageLoader message={'Uno Momento'}></FullPageLoader>
    )
    : (
        <>
            <IonSplitPane contentId="main">
                <ChecklistSummaryList
                    checklistSummaries={getChecklistSummaries(userChecklists)}
                    activeChecklistId={activeChecklistId}
                    addNewChecklist={addNewChecklist}
                    activateChecklist={activateChecklist}
                    deleteChecklist={deleteChecklist}
                    aboutClicked={() => setShowAboutModal(true)}
                />
                <ChecklistPage
                    pageElemId="main"
                    checklist={userChecklists.find(c => c.checklistId === activeChecklistId) || userChecklists[0]}
                    setStoneFoundStatus={(stoneId: number, value: boolean) => {setStoneFoundStatus(activeChecklistId, stoneId, value)}}
                    updateChecklistName={(newChecklistName: string) => {updateChecklistName(activeChecklistId, newChecklistName)}}
                    toggleHideCompletedStones={() => {toggleHideCompletedStones(activeChecklistId)}}
                />
            </IonSplitPane>
            <IonModal isOpen={showAboutModal} className="aboutModal">
                <About dismissHandler={() => setShowAboutModal(false)} startSyncingClicked={props.startSyncingClicked} />
            </IonModal>
        </>
    )
}