"use client";
import useLLM from "usellm";
import React, { useState, useEffect } from "react";

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [caption, setCaption] = useState("");
  const [loadingMemeCaptions, setLoadingMemeCaptions] = useState(false);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const [meme, setMeme] = useState("");

  const llm = useLLM({
    serviceUrl: "https://usellm.org/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });

  const SYSTEM_PROMPT = `You are an AI Meme Bot, designed to generate funny memes. Given a topic of 
  
  ${prompt}

  you will provide a single meme idea and a corresponding image description.
  For example:
  
  Meme Idea: 'When you have a high bias in your model and your boss says, 'Just add more features!''
  Image: A confused person surrounded by piles of random objects.*
  
  Your task is to create hilarious and relatable memes that bring a smile to the user's face.
  The image description should not mention to caption or text .. only should be describing image and
   also should be funny to generate image.
  Remember to keep the language simple, use relatable humor, and ensure that the meme is enjoyable
  and easy to understand.`;

  async function handleClickGenerateMemeCaption() {
    try {
      setLoadingMemeCaptions(true);

      const { message } = await llm.chat({
        messages: [
          {
            role: "user",
            content: SYSTEM_PROMPT,
          },
        ],
      });

      console.log("Received message: ", message.content);
      setCaption(message.content);
      handleGenerateClick(caption.split("Image:")[0].trim()); // Call handleGenerateClick with the initial caption
    } catch (error) {
      console.error("Something went wrong!", error);
    }
  }

  async function handleGenerateClick(ImageDescription:string) {
    try {
      setStatus("Generating...");
      setImage("");

      // const { message } = await llm.chat({
      //   messages: [
      //     {
      //       role: "user",
      //       content: extractedcaption,
      //     },
      //   ],
      // });

      // console.log("Received message: ", message.content);

      const { images } = await llm.generateImage({ prompt: ImageDescription });
      setImage(images[0]);
      setStatus("");
    } catch (error) {
      console.error("Something went wrong!", error);
    }
  }

  useEffect(() => {
    if (caption) {
      handleGenerateClick(caption); // Call handleGenerateClick when the caption state changes
    }
  }, [caption]);

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="font-semibold text-2xl">AI Meme Generator</h2>
      <div className="flex my-4">
        <input
          className="p-2 border rounded mr-2 w-full dark:bg-gray-900 dark:text-white"
          type="text"
          placeholder="Enter a prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium ml-2 "
          onClick={handleClickGenerateMemeCaption}
        >
          Generate
        </button>
      </div>

      {loadingMemeCaptions && <div></div>}

      {caption && (
        <div>
          {/* <h3 className="font-semibold">Meme Caption:</h3> */}
          {/* <p>{caption}</p> */}
          <p>{caption.substring(0, caption.indexOf("Image:")).trim().slice(11,)}</p>
      {/* {meme && (
        <div>
          <h3 className="font-semibold">Meme Caption:</h3>
          <p>{meme}</p> */}
          {/* <button
            className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium mt-2"
            onClick={handleGenerateClick}
          >
            Generate Image
          </button>
        </div>
      )} */}

      {status && <div>{status}</div>}

      {image && (
        <img
          className="mt-4 rounded"
          src={image}
          alt={prompt}
          width={256}
          height={256}
        />
      )}
    </div>
  )}
</div>
)};