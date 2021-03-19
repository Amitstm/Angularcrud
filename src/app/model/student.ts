export class IStudent {
    id?: number;
    firstname: string;
    lastname: string;
    email: string;

}

export class Student implements IStudent {
    id ?= null;
    firstname = '';
    lastname = '';
    email = '';


}
