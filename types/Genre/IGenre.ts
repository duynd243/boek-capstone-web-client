export interface IGenre {
    id: number;
    name: string;
    parentId?: number;
    displayIndex?: number;
    status?: boolean;
    statusName?: string;
}