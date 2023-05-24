import { BaseService } from '../../config/base.service';
import { PersonDTO } from '../dto/person.dto';
import { PersonEntity } from '../entity/person.entity';
import { DocumentService } from '../../document_type/service/document.service';
import { RoleService } from '../../role/services/role.service';

import bcrypt from 'bcrypt';
export class PersonService extends BaseService<PersonEntity>{

    constructor(
        private readonly documentService:DocumentService = new DocumentService(),
        private readonly roleService:RoleService = new RoleService()
    ){
        super(PersonEntity)
    }

    async findAll(): Promise<PersonEntity[] | undefined> {
        try {
            return (await this.execRepository)
                .createQueryBuilder("person")
                .leftJoin("person.role", "role")
                .leftJoin("person.document_type","document")
                .select(["person", "role.name", "document.name"])
                .getMany()
        } catch (error:any) {
            throw new Error(error)
        }
    }

    async create(person: PersonDTO): Promise<PersonEntity> {
        try {
            const document = await this.documentService.findById(person.document_id)
            const role = await this.roleService.findById(person.role_id)
            if (document && role) {
                const newPerson = (await this.execRepository).create(person)
                newPerson.password = await bcrypt.hash(newPerson.password, 10) 
                newPerson.role = role
                newPerson.document_type = document
                return (await this.execRepository).save(newPerson)
            } else {
                throw new Error(`verify id of document and role`)
            }
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async findOneByEmail(institutional_mail: string): Promise<PersonEntity | null> {
        try {
            return (await this.execRepository)
                .createQueryBuilder("person")
                .addSelect("person.password")
                .where({ institutional_mail })
                .getOne()
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async findOneBy(term: string): Promise<PersonEntity | null> {
        try {
            return (await this.execRepository)
                .createQueryBuilder("person")
                .leftJoin("person.role", "role")
                .leftJoin("person.document_type", "document")
                .where(
                    ` 
                    person.code = :term OR 
                    person.institutional_mail = :term`,
                    { term })
                .select([
                    "person",
                    "document.name",
                    "role.name"
                ])
                .getOne()
        } catch (error: any) {
            throw new Error(error)
        }
    }
}