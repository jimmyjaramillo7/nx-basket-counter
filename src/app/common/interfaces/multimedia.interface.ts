export interface IMedia {
    _id:string;
    
    type:string;

    name:string;
  
    path:string; 

    createdAt: Date;
}

export interface IMediaResponse {
    docs: IMedia[];
    total: number;
    limit: number;
    skip: number;
}