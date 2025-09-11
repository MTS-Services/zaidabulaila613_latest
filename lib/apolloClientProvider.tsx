'use client'

import { ApolloProvider } from '@apollo/client'
import client from '@/lib/apolloClient'
import { SnackbarProvider } from 'notistack'

export default function ApolloClientProvider({ children }: { children: React.ReactNode }) {
    return <ApolloProvider client={client}>
        <SnackbarProvider />
        {children}
    </ApolloProvider>
}