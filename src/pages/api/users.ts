import {NextApiRequest, NextApiResponse} from 'next'


export default (request: NextApiRequest, response: NextApiResponse) => {
 const users = [
     {id: 1, name: 'Fernando'},
     {id: 2, name: 'Rogerio'},
     {id: 3, name: 'Jose'},
] 

return response.json(users)
}