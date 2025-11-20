import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// EMAIL
export const getEmailEasy = async (req: Request, res: Response) => {
  const data = await prisma.gameEmailEasy.findMany();

  // Shuffle and pick 10
  const random10 = data.sort(() => Math.random() - 0.5).slice(0, 10);

  res.json({ questions: random10, total: random10.length });
};

export const getEmailMedium = async (req: Request, res: Response) => {
  const data = await prisma.gameEmailMedium.findMany();
  const random10 = data.sort(() => Math.random() - 0.5).slice(0, 10);

  res.json({ questions: random10, total: random10.length });

};

export const getEmailHard = async (req: Request, res: Response) => {
  const data = await prisma.gameEmailHard.findMany();
  const random10 = data.sort(() => Math.random() - 0.5).slice(0, 10);

  res.json({ questions: random10, total: random10.length });

};

// SMS
export const getSMSEasy = async (req: Request, res: Response) => {
  const data = await prisma.gameSMSEasy.findMany();
  const random10 = data.sort(() => Math.random() - 0.5).slice(0, 10);

  res.json({ questions: random10, total: random10.length });

};

export const getSMSMedium = async (req: Request, res: Response) => {
  const data = await prisma.gameSMSMedium.findMany();
  const random10 = data.sort(() => Math.random() - 0.5).slice(0, 10);

  res.json({ questions: random10, total: random10.length });

};

export const getSMSHard = async (req: Request, res: Response) => {
  const data = await prisma.gameSMSHard.findMany();
  const random10 = data.sort(() => Math.random() - 0.5).slice(0, 10);

  res.json({ questions: random10, total: random10.length });

};
