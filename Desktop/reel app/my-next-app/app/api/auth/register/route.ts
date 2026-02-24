import { NextRequest, NextResponse } from "next/server";
import { connectTodatabase } from "@/lib/db";
import User from "@/models/user";


 export async function POST (request:NextRequest){

    try {
        const {email, password}=await request.json();
        if(!email || !password){
            return NextResponse.json(
                { error: "email and password are required"},
                {status: 400}
            )
        }
        await connectTodatabase()

        const existingUser= await User.findOne({ email})
        if (!existingUser){
            return NextResponse.json(
                { error: "Already your email registered please try again later New email"},
                {status: 400}
            )
        }
        await User.create({ email, password})

        return NextResponse.json(
            {message: "user registered successfully"},
            {status: 201}
        )

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Oooh! Failed to register || try again 😊" },
            { status: 500 }
        );
    }


 }