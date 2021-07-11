import { ModelIdentity } from "../../core/domain/models";


export interface Workspace extends ModelIdentity {
    id: string;
    name: string;
}

export interface Dependency {
    rootApplication: string;
    dependencies: Dependency[];
}

/***
 * id: internal globally unique id for the workspace
 * workspaceName: the user's name for the workspace
 */
export interface WorkspaceContext {
    id: string;
    workspaceName: string;
    node: string;
    application: Dependency;
}

export interface OperationResult {
    result: string;
}

/**
  getWorkspace
  createWorkspace
  deleteWorkspace
  detachWorkspace
  housekeeping: 
   - relocates workspaces to other containers and even other nodes
       - things it considers
           - resource pressure on the node
           - size of the workspace
           - user's activity
           - free vs paid
   - detaches orphaned workspaces
       - normally a user will close apps, etc. and explicitly 'close' a workspace
           - maybe reference counting by client id
       - other times, a workspace will be left idle and open and will timeout
           - api calls
           - friggin ui crashes
   - archives stale workspaces
       - things it considers
           - time since last activity
           - user activity and patterns
           - free vs paid 
 */
export interface IWorkspaceManager {
    getWorkspace(userId: string, workspaceName: string): Promise<WorkspaceContext>;
    createWorkspace(userId: string, workspaceName: string): Promise<Workspace>;
    deleteWorkspace(userId: string, workspaceName: string) : Promise<void>;
    
    detachWorkspace(userId: string, workspaceName:  string) : Promise<void>;

    housekeeping() : Promise<OperationResult>;
}

export class WorkspaceManager {

}