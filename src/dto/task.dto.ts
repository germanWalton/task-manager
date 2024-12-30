export class CreateTaskDto {
  title: string;
  description?: string;

  constructor(title: string, description?: string) {
    this.title = title;
    this.description = description;
  }
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
}
