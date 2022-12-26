import { ApolloServer, gql } from 'apollo-server';
import {v1 as uuid} from 'uuid';

let employees =[
    {
        name:"Ana",
        age:17,
        phone:"01425522002",
        street:"Milton Street 24",
        city:"London",
        id:"01ed-40g8-18te"
    },
    {
        name:"Jana",
        age:16,
        phone:"015845214521",
        street:"Smith Street 5",
        city:"Liverpool",
        id:"01ed-80rf-45rm"
    },
    {
        name:"Jenny",
        age:27,
        street:"Waterloo Street 11",
        city:"London",
        id:"0u8i-56io-1122"
    },
    {
        name:"Thomas",
        age:29,
        street:"Irish Street 86",
        city:"Dublin",
        id:"08fv-6y8h-ty89"
    },
    {
        name:"Peter",
        age:15,
        street:"Malvinas Street 11",
        city:"Southampton",
        id:"0pl8-5nm2-1vc4"
    },
    {
        name:"John",
        age:58,
        street:"London Street 18",
        city:"Manchester",
        id:"08rt-489h-17ty"
    },

]

//to describe the data:
const typeDefs = gql`

    type Address{
        street: String!
        city: String!
    }
    type Employee {
        name: String!
        age: Int!
        phone: String
        address:Address!
        canDrink: Boolean
        id: ID!
    }

    type Query {
        employeesCount: Int!
        allEmployees: [Employee]!
        findEmployee (name: String!): Employee

    }

    type Mutation {
        addEmployee(
            name: String!
            age: Int!
            phone: String
            street:String!
            city:String!
        ):Employee
    }


 


`

const resolvers = {
    Query: {
        employeesCount: ()=>employees.length,
        allEmployees: ()=> employees,
        findEmployee: (root, args)=> {
            const {name} =args;
            return employees.find(employee => employee.name === name)
        }
    },
    Mutation: {
        addEmployee: (root, args)=>{
            //const {name,age, street, city, phone} =args
            const newEmployee= {...args, id: uuid()}
            employees.push(newEmployee);// update database with new employee
            return newEmployee;

        }

    }
    ,
    Employee: {
        canDrink:(root) => root.age > 18,
        address:(root) => {
            return{
                street:root.street,
                city: root.city
            }
        }

    }
    
    /* Employee: {
        canDrink:(root) => root.age > 18,
        address: (root) => `${root.street}, ${root.city}`,
    } */

    //performed by default by apolo server:
  /*   Employee: {
        name: (root)=> root.name,
        street: (root)=> root.street,
        phone: (root)=> root.phone,
        city: (root)=> root.city,
        id: (root)=> root.id,

    } */
}

//create a server:

const server = new ApolloServer({
    typeDefs,
    resolvers
})

// to initialize the server

server.listen()
.then(({url})=>{
    console.log(`Server is running on ${url}`)
})
