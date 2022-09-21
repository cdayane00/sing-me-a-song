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

    describe('POST /recommendations/:id/upvote', ()=>{
        it('should return sucess when exist a recommendation, return status code equal 200', async ()=>{
            const data = await createRecommendation();
            const res = await supertest(app).post(`/recommendations/${data.id}/upvote`).send();

            expect(res.status).toBe(200);
        });

        it('should return status code 404 when a recommendation is not found', async ()=>{
            const id = faker.datatype.number({max: 0});
            const res = await supertest(app).post(`/recommendations/${id}/upvote`).send();

            expect(res.status).toBe(404);
        });

        it('should return score +1 when the recommendation exists', async ()=>{
            const data = await createRecommendation();
            await supertest(app).post(`/recommendations/${data.id}/upvote`).send();
            const result = await loadRecommendation(data.id);

            expect(result.score - data.score).toEqual(1);
        });
    });

    describe('POST /recommendations/:id/downvote', ()=>{
        it('should return sucess when exist a recommendation, return status code equal 200', async()=>{
            const data = await createRecommendation();
            const res = await supertest(app).post(`/recommendations/${data.id}/upvote`).send();
            
            expect(res.status).toBe(200);
        });

        it('should return status code 404 when a recommendation is a not found', async ()=>{
            const id = faker.datatype.number({max: 0});
            const res = await supertest(app).post(`/recommendations/${id}/downvote`).send();

            expect(res.status).toBe(404)
        });

        it('should return score equal -1 when the recommendation exists', async ()=>{
            const data = await createRecommendation();
            await supertest(app).post(`/recommendations/${data.id}/downvote`).send();
            const result = await loadRecommendation(data.id);

            expect(result.score - data.score).toEqual(-1);
        });

        it('should delete recommendation if score is equal -5', async ()=>{
            const data = await createRecommendation({score: -5});
            await supertest(app).post(`/recommendations/${data.id}/downvote`).send();
            const result = await loadRecommendation(data.id);

            expect(result).toBeNull();
        });
    })
})