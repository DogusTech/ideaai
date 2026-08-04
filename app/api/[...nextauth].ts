import { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

const firebaseApp = FirebaseApp.initializeApp({