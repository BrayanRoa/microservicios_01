import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from '../../config/base.entity';
import { PersonEntity } from '../../persons/entity/person.entity';

@Entity({name:"role"})
export class RoleEntity extends BaseEntity{

    @Column({
        type:"varchar",
        length:30,
        nullable:false,
        unique:true
    })
    name!:string

    @Column({
        type:"boolean",
        nullable:false,
        default:false
    })
    state!:boolean

    @OneToMany(() => PersonEntity, (person) => person.role)
    person!:PersonEntity[]
}