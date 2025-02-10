import { Name, Uuid } from 'src/@core/value-object';
import { CategoryProps, CreateCategoryCommand } from './input/category-props';

export class Category {
  private id: Uuid;
  private name: Name;
  private responsible_id: Uuid;
  private created_at: Date;
  private updated_at: Date;

  constructor(props: CategoryProps) {
    this.id = props.id instanceof Uuid ? props.id : new Uuid(props.id);
    this.name = props.name instanceof Name ? props.name : new Name(props.name);
    this.responsible_id =
      props.responsible_id instanceof Uuid
        ? props.responsible_id
        : new Uuid(props.responsible_id);
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(command: CreateCategoryCommand): Category {
    return new Category({
      id: new Uuid(),
      name: new Name(command.name),
      responsible_id: command.responsible_id
        ? new Uuid(command.responsible_id)
        : null,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  // Getters

  public getId(): string {
    return this.id.value;
  }

  public getName(): string {
    return this.name.value;
  }

  public getResponsibleId(): string {
    return this.responsible_id.value;
  }

  public getCreatedAt(): Date {
    return this.created_at;
  }

  public getUpdatedAt(): Date {
    return this.updated_at;
  }
}
