export class CreateChatDTO {
    constructor(public question: string, public answer: string | null, public task_id: string) {}
}