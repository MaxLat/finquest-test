import { Country } from "./country-interface"
import { Department } from "./department-interface"

export interface User {
    id : number,
    firstname : string,
    lastname : string,
    isAlreadyConnected? : boolean,
    lastConnectionDate? : Date,
    skillsId : Array<string>,
    birthdate? : Date,
    profileCompletion? :number,
    department : Department,
    country : Country
}