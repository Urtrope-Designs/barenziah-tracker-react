import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import { StoneChecklist } from '../declarations';
import ChecklistPage from './Checklist';

interface ChecklistPageResolverProps extends RouteComponentProps<{
    checklistId: string;
}> {
    userChecklists: StoneChecklist[];
    toggleStoneFoundStatus(checklistId: string, stoneId: number): any;
}

const ChecklistPageResolver: React.FC<ChecklistPageResolverProps> = ({match, userChecklists, toggleStoneFoundStatus}) => {
    const currentChecklist = userChecklists.find(checklist => checklist.checklistId === match.params.checklistId);
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