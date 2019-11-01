import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import { StoneChecklist } from '../declarations';
import ChecklistPage from './Checklist';

interface ChecklistPageResolverProps extends RouteComponentProps<{
    checklistId: string;
}> {
    userChecklistsMap: Map<string, StoneChecklist>;
}

const ChecklistPageResolver: React.FC<ChecklistPageResolverProps> = ({match, userChecklistsMap}) => {
    const currentChecklist = userChecklistsMap.get(match.params.checklistId);
    if (currentChecklist === undefined) {
        return <Redirect to="/" exact={true} />;
    }
    return <ChecklistPage checklistId={match.params.checklistId} checklist={currentChecklist} />;
}

export default ChecklistPageResolver;