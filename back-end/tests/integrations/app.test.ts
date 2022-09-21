import {faker} from '@faker-js/faker';
import supertest from 'supertest';
import app from '../../src/app';
import cleanDataBase from '../helpers/cleanDataBase';
import {createRecommendation, loadRecommendation} from '../factories/recommendationsFactory';

beforeEach(async ()=>{
    await cleanDataBase();
});

describe('Integrantion tests', ()=>{
    describe('POST /recommendations', () => {
        it('should create a new recommendation, return status code 201', async ()=>{
            
            const body = {
                name: faker.lorem.words(2),
                youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`
            };

            const res = await supertest(app).post('/recommendations').send(body);

            expect(res.status).toBe(201);
        });

        it('Wrong data for create recommendation, should return code 422', async ()=>{
            const body = {
                name: faker.lorem.words(2),
                youtubeLink: `https://www.netflix.com/${faker.datatype.uuid()}`
            }

            const res = await supertest(app).post('/recommendations').send(body);

            expect(res.status).toBe(422);
        });

        it('Recommendation already created, should return status code 409', async ()=>{
            const data = await createRecommendation();
            const result = await loadRecommendation(data.id);

            const body = {
                name: result.name,
                youtubeLink: result.youtubeLink
            };

            const res = await supertest(app).post('/recommendations').send(body);

            expect(res.status).toBe(409);
        });

    });
})