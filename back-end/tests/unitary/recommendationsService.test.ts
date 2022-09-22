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
    });

    describe('upvote', ()=>{
        it('should get a recommendation by id', async()=>{
            const recommendation = await createRecommendation();
            const spy = jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any=> recommendation);
            jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any=>{});

            await recommendationService.upvote(recommendation.id);

            expect(spy).toBeCalledWith(recommendation.id);
        });

        it('should not get a recommendation by id that not exist', async()=>{
            const id = faker.datatype.number({max: 0});
            jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any=>{});
            jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any=>{});
            const result = recommendationService.upvote(id);

            expect(result).rejects.toEqual({type: 'not_found', message: ''});
        });

        it('should call function updateScore with correct data', async()=>{
            const recommendation = await createRecommendation();
            jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any=>recommendation);
            const spy = jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce(recommendation);

            await recommendationService.upvote(recommendation.id);

            expect(spy).toBeCalledWith(recommendation.id, 'increment');
        });
    })
})
