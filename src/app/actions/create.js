'use server'

import { client } from "@/lib/db"

export async function createBook(formData) {
  const {title, rating, author, blurb} = Object.fromEntries(formData)

  //create book id
  let nextBookId = await client.get("nextBookId");
  if (!nextBookId){
    nextBookId = 1
  }

  //check if the title book exists
  const unique = await client.zAdd('books',{
    value: title,
    score: nextBookId,
  }, {NX: true})
  
  if (!unique){
    return {"error": "This book has already been added"}
  }

  const result = await client.hSet(`books:${nextBookId}`, {
    title,
    rating,
    author,
    blurb,
  })
  
  //store the book id+1
  client.set("nextBookId", parseInt(nextBookId)+1);

  console.log(result)

  return true
}