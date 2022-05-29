import NextAuth from "next-auth"
import { query as q } from "faunadb"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from 'next-auth/providers/google'

import { fauna } from '../../../services/fauna'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })

  ],

  callbacks: {
    async signIn({ user, account, profile }) {

      const { email } = user

      try {

        await fauna.query(
         q.If( // se não existir um usuario com email informado
           q.Not(
             q.Exists(
               q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
               )
             )
           ), // cria usuario
           q.Create(
            q.Collection('users'),
            { data: { email } }
          ), //senão busca usuario
          q.Get(
            q.Match(
              q.Index('user_by_email'),
              q.Casefold(user.email)
           )
          )
         )
        )
        return true
      } catch (error) {

      }

      return false
    },
  },

})