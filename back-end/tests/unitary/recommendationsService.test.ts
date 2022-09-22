import { faker } from "@faker-js/faker";
import {jest} from '@jest/globals';
import _ from 'lodash';
import cleanDataBase from "../helpers/cleanDataBase";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import { createRecommendation, createRecommendationData } from "../factories/recommendationsFactory";

beforeEach(async ()=>{
    await cleanDataBase();
    jest.resetAllMocks();
});

describe('Unitary tests', ()=>{
    describe('insert',()=>{
        it('shoul call function create recommendation with correct createDataRecommendation', async()=>{
            const recommendation = createRecommendationData();
            const spy = jest.spyOn(recommendationRepository, 'create').mockImplementationOnce((): any=>{});
            jest.spyOn(recommendationRepository,'findByName').mockImplementationOnce(():any=>{});

            await recommendationService.insert(recommendation);

            expect(spy).toBeCalledWith(recommendation);
        });

        it('should call findByName with correct createDataRecommendation', async ()=>{
            const recommendation = createRecommendationData();
            const spy = jest.spyOn(recommendationRepository, 'findByName').mockResolvedValue(undefined);
            jest.spyOn(recommendationRepository, 'create').mockImplementationOnce((): any=>{});

            await recommendationService.insert(recommendation);

            expect(spy).toBeCalledWith(recommendation.name);
        });

        it('shoul throw error when have a conflict name', async()=>{
            const recommendation = await createRecommendation();
            jest.spyOn(recommendationRepository,'findByName').mockResolvedValue(recommendation);
            jest.spyOn(recommendationRepository, 'create').mockImplementationOnce(():any =>{});
            const result = recommendationService.insert(recommendation);

            expect(result).rejects.toEqual({
                type: 'conflict',
                message: 'Recommendations names must be unique'
            });
        });
    })
})
