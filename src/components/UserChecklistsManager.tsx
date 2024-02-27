import { IonModal, IonSplitPane } from '@ionic/react';
import { FirebaseApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { StoneChecklist } from '../declarations';
import ChecklistPage from '../pages/ChecklistPage';
import { createNewStoneChecklist, getChecklistSummaries } from '../util/user-checklists';
import ChecklistSummaryList from './ChecklistSummaryList';
import FullPageLoader from './FullPageLoader';
import { About } from './About';

interface UserChecklistManagerProps {
    logOutClicked(): any;
    deleteUserClicked(): any;
    firebaseApp: FirebaseApp;
    userId: string;
}

const UserChecklistsManager: React.FC<UserChecklistManagerProps> = ({firebaseApp, userId, logOutClicked, deleteUserClicked}) => {
    const [userChecklists, setUserChecklists] = useState<StoneChecklist[]>([]);
    const [activeChecklistId, setActiveChecklistId] = useState<string | null>(null);
    const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
    const db = getFirestore(firebaseApp);

    const updateStoneListData = (checklistToUpdateId: string, callerName: string, updateFunc: (existingChecklist: StoneChecklist) => StoneChecklist) => {
        const listToUpdate = userChecklists.find(checklist => checklist.checklistId === checklistToUpdateId);
        if (listToUpdate == null) {
            console.error(`${callerName}() invalid checklistId: ${checklistToUpdateId}`);
        } else {
            const newList: StoneChecklist = updateFunc(listToUpdate);

            setDoc(doc(db, 'users', userId, 'checklists', checklistToUpdateId), newList);

            return null;
        };
    }

    const setStoneFoundStatus = (checklistId: string, stoneId: number, value: boolean) => {
        updateStoneListData(checklistId, 'setStoneFoundStatus', (curList: StoneChecklist) => {
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

    const updateChecklistName = (checklistId: string, newChecklistname: string) => {
        updateStoneListData(checklistId, 'updateChecklistName', (curList: StoneChecklist) => {
            return {
                ...curList,
                checklistName: newChecklistname,
            }
        });
    }

    const toggleHideCompletedStones = (checklistId: string) => {
        updateStoneListData(checklistId, 'toggleHideCompletedStones', (curList: StoneChecklist) => {
            return {
                ...curList,
                hideCompletedStones: !curList.hideCompletedStones,
            }
        });
    }

    const addNewChecklist = useCallback(async (newChecklistName: string) => {
        const newChecklist: StoneChecklist = createNewStoneChecklist(newChecklistName);
        const docRef = await addDoc(collection(db, 'users', userId, 'checklists'), newChecklist);
        setDoc(doc(db, 'users', userId), {
            activeChecklistId: docRef.id
        });
    }, [userId, db]);

    const activateChecklist = (checklistId: string) => {
        if (checklistId != null && userChecklists.some(c => c.checklistId === checklistId)) {
            setDoc(doc(db, 'users', userId), {
                activeChecklistId: checklistId
            });
        } 
        return null;
    }

    const deleteChecklist = async (checklistId: string) => {
        await deleteDoc(doc(db, 'users', userId, 'checklists', checklistId));
        if (activeChecklistId === checklistId && userChecklists.length > 1) {
            const firstChecklistId = userChecklists[0].checklistId;
            activateChecklist(firstChecklistId === checklistId ? userChecklists[1].checklistId : firstChecklistId);
        } 
        return null;
    }

    const hydrateChecklistFromFB = (fbChecklistDoc: QueryDocumentSnapshot): StoneChecklist => {
        const extractedChecklist: StoneChecklist = {...(fbChecklistDoc.data() as StoneChecklist)};
        extractedChecklist.checklistId = fbChecklistDoc.id;
        return extractedChecklist;
    }

    const aboutClicked = () => {
        setShowAboutModal(true);
    }

    useEffect(() => {
        const checklistObserver = onSnapshot(collection(db, 'users', userId, 'checklists'), checklistSnapshot => {
            if (checklistSnapshot.size < 1) {
                addNewChecklist('Untitled');
            } else {
                setUserChecklists(checklistSnapshot.docs.map(hydrateChecklistFromFB));
            }
        });

        return checklistObserver;
    }, [userId, addNewChecklist, db]);

    useEffect(() => {
        const userObserver = onSnapshot(doc(db, 'users', userId), userSnapshot => {
            const userData = userSnapshot.data();
            if (userData !== undefined) {
                setActiveChecklistId(userData.activeChecklistId);
            }
        });

        return userObserver;
    }, [userId, db]);

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
                        logOutClicked={logOutClicked}
                        aboutClicked={aboutClicked}
                    />
                    <ChecklistPage
                        pageElemId="main"
                        checklist={userChecklists.find(c => c.checklistId === activeChecklistId) || userChecklists[0]}
                        setStoneFoundStatus={(stoneId: number, value: boolean) => {setStoneFoundStatus(activeChecklistId, stoneId, value)}}
                        updateChecklistName={(newChecklistName: string) => {updateChecklistName(activeChecklistId, newChecklistName)}}
                        toggleHideCompletedStones={() => {toggleHideCompletedStones(activeChecklistId)}}
                    />

                </IonSplitPane>
                <IonModal isOpen={showAboutModal} class="aboutModal">
                    <About dismissHandler={() => setShowAboutModal(false)} deleteUserClicked={deleteUserClicked}/>
                </IonModal>
            </>
        )
}

export default UserChecklistsManager;