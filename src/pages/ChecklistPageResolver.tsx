import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import { StoneChecklist } from '../declarations';
import ChecklistPage from './Checklist';

interface ChecklistPageResolverProps extends RouteComponentProps<{
    checklistId: string;
}> {
    userChecklistsMap: Map<string, StoneChecklist>;
    toggleStoneFoundStatus(checklistId: string, stoneId: number): any;
}

const ChecklistPageResolver: React.FC<ChecklistPageResolverProps> = ({match, userChecklistsMap, toggleStoneFoundStatus}) => {
    const currentChecklist = userChecklistsMap.get(match.params.checklistId);
    if (currentChecklist === undefined) {
        return <Redirect to="/" exact={true} />;
    }
    return (
        <ChecklistPage
            checklist={currentChecklist}
            toggleStoneFoundStatus={(stoneId: number) => toggleStoneFoundStatus(match.params.checklistId, stoneId)}
        />
    );
}

export default ChecklistPageResolver;