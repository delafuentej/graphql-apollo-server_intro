import { ApolloServer, gql, UserInputError } from 'apollo-server';
import axios from 'axios';
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


    enum YesNo {
        YES
        NO
    }

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
        allEmployees(phone: YesNo): [Employee]!
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

        editPhoneNumber(
            name:String!
            phone:String!
        ): Employee

    }


 


`

const resolvers = {
    Query: {
        employeesCount: ()=>employees.length,
        /* allEmployees: ()=>employees, */
        /* allEmployees: (root, args)=> {
            if(!args.phone) return employees
 
            const byPhone= employee => (args.phone === "YES") ? employee.phone : !employee.phone

            return employees.filter(byPhone)
            
        },  */
        allEmployees: async(root,args)=>{
            const {data: employeesFromApi}= await axios.get('http://localhost:3000/employees')
            console.log('employeesFromApi', employeesFromApi)

            if(!args.phone) return employeesFromApi
 
            const byPhone= employee => (args.phone === "YES") ? employee.phone : !employee.phone

            return employeesFromApi.filter(byPhone)


        },
        findEmployee: (root, args)=> {
            const {name} =args;
            return employees.find(employee => employee.name === name)
        }
    },
    Mutation: {
        addEmployee: (root, args)=>{
            if(employees.find(employee => employee.name === args.name)){
                throw new UserInputError("Name must be unique",{
                    invalidArgs: args.name
                })
            }
            //const {name,age, street, city, phone} =args
            const newEmployee= {...args, id: uuid()}
            employees.push(newEmployee);// update database with new employee
            return newEmployee;

        },

        editPhoneNumber: (root, args)=>{
            const employeeIndex = employees.findIndex( employee => employee.name === args.name)
            if (employeeIndex === -1) return null
            const employee = employees[employeeIndex]
            const updatedPhoneNumber= {...employee, phone: args.phone}
            employees[employeeIndex]= updatedPhoneNumber
            return updatedPhoneNumber



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
