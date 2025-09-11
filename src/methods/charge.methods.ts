import { Charge } from '../types/Charge';
import { DatabaseProvider } from '../database/types';
import { v4 as uuidv4 } from 'uuid';
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

    
    // i will implement this soon
    // const existingCharge = db.getChargeByCorrelationID(correlationID);
    // if (existingCharge) {
    //     return {
    //         data: null,
    //         error: 'Charge with this correlation ID already exists',
    //     };
    // }

    
    const newCharge: Charge = {
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