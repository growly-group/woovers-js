import { Charge } from '../types/Charge';
import { DatabaseProvider } from '../database/types';
import { randomUUIDv7 } from "bun";
import { CreateChargeInput } from '../types/CreateChargeInput';
import type { Request, Response } from 'express';


const createCharge = (db: DatabaseProvider, data: CreateChargeInput): 
    { data: Charge | null; error: string | null } => {
    
    const {
        correlationID, 
        value, 
        type, 
        comment, 
        expiresIn, 
        expiresDate, 
        customer,
        ensureSameTaxID,
        daysForDueDate,
        daysAfterDueDate,
        interests,
        fines,
        discountSettings,
        additionalInfo,
        enableCashbackPercentage,
        enableCashbackExclusivePercentage,
        subaccount,
        splits
    } = data;

    
    if (!correlationID) {
        return {
            data: null,
            error: 'Correlation ID is required',
        };
    }

    if (value <= 0) {
        return {
            data: null,
            error: 'Value should be a positive number',
        };
    }

    

    const existingCharge = db.getChargeByID(correlationID);
    if (existingCharge) {
        return {
            data: null,
            error: 'Charge with this correlation ID already exists',
        };
    }

    
    const newCharge: Charge = {
        id: randomUUIDv7(),
        correlationID,
        value,
        type: type || 'DYNAMIC',
        comment,
        expiresIn,
        expiresDate,
        customer,
        ensureSameTaxID: ensureSameTaxID || false,
        daysForDueDate,
        daysAfterDueDate,
        interests,
        fines,
        discountSettings,
        additionalInfo,
        enableCashbackPercentage: enableCashbackPercentage || false,
        enableCashbackExclusivePercentage: enableCashbackExclusivePercentage || false,
        subaccount,
        splits,
    };

    
    try {
        db.createCharge(newCharge);
        return {
            data: newCharge,
            error: null,
        };
    } catch (error) {
        console.error(error);
        return {
            data: null,
            error: 'Failed to create charge',
        };
    }
};


export const createChargeStatic = async (req: Request, res: Response) => {
    const { 
        correlationID, 
        value, 
        type, 
        comment, 
        expiresIn, 
        expiresDate, 
        customer,
        ensureSameTaxID,
        daysForDueDate,
        daysAfterDueDate,
        interests,
        fines,
        discountSettings,
        additionalInfo,
        enableCashbackPercentage,
        enableCashbackExclusivePercentage,
        subaccount,
        splits
    } = req.body;

    const db = req.context.db;

    const { data, error } = createCharge(db, {
        correlationID,
        value,
        type,
        comment,
        expiresIn,
        expiresDate,
        customer,
        ensureSameTaxID,
        daysForDueDate,
        daysAfterDueDate,
        interests,
        fines,
        discountSettings,
        additionalInfo,
        enableCashbackPercentage,
        enableCashbackExclusivePercentage,
        subaccount,
        splits,
    });

    if (error) {
        return res.status(400).send({
            error,
        });
    }

    res.status(201).send({
        charge: data,
    });
};

const getChargeByID = (db: DatabaseProvider, correlationID: string): { data: Charge | null; error: string | null } => {

    const result = db.getChargeByID(correlationID);

    if(!result){
        return {
            data: null, 
            error: 'Charge not found'
        }
    }

    return{
        data: result,
        error: null
    }

}

export const getCharge = async(req: Request, res: Response) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ error: 'Identifier is required' });
      }

    const db = req.context.db;

    const result = getChargeByID(db, id);

    if(!result.data){
        return res.status(400).send({error: result.error});
    }

    return res.status(200).send(result.data);

}