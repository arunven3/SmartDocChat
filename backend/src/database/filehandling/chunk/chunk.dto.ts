export class CreateChunkDTO {
    constructor(public chunk: string, public embedding: number[], public document_id: number, public task_id: string){}
}