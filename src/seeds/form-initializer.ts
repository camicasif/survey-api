import {Injectable, OnModuleInit} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from '../form/form.entity';
import { Question } from '../form/question.entity';
import { Answer } from '../form/answer.entity';

@Injectable()
export class FormInitializer implements OnModuleInit{
    constructor(
        @InjectRepository(Form)
        private readonly formRepository: Repository<Form>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
    ) {}

    async onModuleInit() {
        // Verificar si ya existen formularios
        const formCount = await this.formRepository.count();
        if (formCount === 0) {
            // Crear Formulario de prueba
            const testForm = this.formRepository.create({
                title: 'Formulario de prueba',
                description: 'Este es un formulario de prueba con preguntas de ejemplo.',
                isOpen: true,
                nTimesTaken: 0,
            });
            const savedTestForm = await this.formRepository.save(testForm);

            const testQuestions = [
                {
                    description: '¿Pregunta de prueba 1?',
                    form: savedTestForm,
                    answers: [
                        { description: 'Respuesta 1A' },
                        { description: 'Respuesta 1B' },
                        { description: 'Respuesta 1C' },
                    ],
                },
                {
                    description: '¿Pregunta de prueba 2?',
                    form: savedTestForm,
                    answers: [
                        { description: 'Respuesta 2A' },
                        { description: 'Respuesta 2B' },
                        { description: 'Respuesta 2C' },
                    ],
                },
            ];

            for (const questionData of testQuestions) {
                const question = this.questionRepository.create({
                    description: questionData.description,
                    form: questionData.form,
                });
                const savedQuestion = await this.questionRepository.save(question);

                const answers = questionData.answers.map((answer) =>
                    this.answerRepository.create({ description: answer.description, question: savedQuestion }),
                );
                await this.answerRepository.save(answers);
            }

            // Crear formulario de Economía Experimental
            const economicForm = this.formRepository.create({
                title: 'Economía Experimental',
                description: 'Formulario para evaluar decisiones y preferencias económicas en situaciones hipotéticas.',
                isOpen: true,
                nTimesTaken: 0,
            });
            const savedEconomicForm = await this.formRepository.save(economicForm);

            const economicQuestions = [
                {
                    description: 'Si tus amigos te invitan a un parque de diversiones, pero solo te puedes montar en una de estas atracciones, ¿cuál elegirías?',
                    answers: [
                        { description: 'Una montaña rusa extrema.' },
                        { description: 'Una montaña rusa moderada.' },
                        { description: 'Una rueda de la fortuna.' },
                    ],
                },
                {
                    description: 'Te ofrecen $100 ahora o la opción de lanzar una moneda para ganar $300 si sale cara, o $0 si sale cruz. ¿Qué harías?',
                    answers: [
                        { description: 'Tomo los $100 seguros.' },
                        { description: 'Lanzo la moneda para intentar ganar $300.' },
                        { description: 'No estoy seguro, pero probablemente tomaría los $100.' },
                    ],
                },
                {
                    description: 'En un videojuego, puedes elegir entre luchar contra un jefe difícil que te da 1000 puntos o varios enemigos fáciles que te dan 200 puntos cada uno. ¿Qué harías?',
                    answers: [
                        { description: 'Luchar contra el jefe, el riesgo vale la pena.' },
                        { description: 'Luchar contra los enemigos más fáciles y seguros.' },
                        { description: 'Dependería de cómo me sienta en el momento.' },
                    ],
                },
                {
                    description: 'Te proponen un negocio que podría triplicar tu dinero en un mes, pero también podrías perder todo. ¿Participarías?',
                    answers: [
                        { description: 'Sí, el riesgo es emocionante.' },
                        { description: 'No, prefiero mantener lo que tengo.' },
                        { description: 'Solo si tengo dinero extra que no necesite.' },
                    ],
                },
                {
                    description: 'Estás en una competencia escolar de talentos, y tienes la opción de hacer un número sencillo que sabes que puedes manejar, o un número complicado que, si sale bien, te haría ganar más puntos. ¿Qué harías?',
                    answers: [
                        { description: 'Intento el número complicado.' },
                        { description: 'Hago el número sencillo, es más seguro.' },
                        { description: 'Me retiro, no me gusta la competencia.' },
                    ],
                },
                {
                    description: 'Te ofrecen una beca parcial para un curso que te interesa mucho, pero puedes aplicar a otra beca completa que es muy difícil de ganar. ¿Qué harías?',
                    answers: [
                        { description: 'Me conformo con la beca parcial.' },
                        { description: 'Aplico a la beca completa y arriesgo perder todo.' },
                        { description: 'Aplico a ambas, aunque podría perder las dos.' },
                    ],
                },
                {
                    description: 'Tienes $200 ahorrados y puedes invertirlos en una opción segura que te da un 5% anual, o en una inversión riesgosa que podría duplicar tu dinero o hacerte perder la mitad. ¿Qué harías?',
                    answers: [
                        { description: 'Invierto en la opción segura.' },
                        { description: 'Tomo el riesgo con la opción riesgosa.' },
                        { description: 'Divido el dinero entre ambas opciones.' },
                    ],
                },
                {
                    description: 'En un examen, puedes responder preguntas fáciles para asegurar un puntaje mínimo o intentar las difíciles, que podrían darte una calificación alta si las aciertas, pero si fallas, bajas tu nota. ¿Qué harías?',
                    answers: [
                        { description: 'Respondo las difíciles para obtener más puntos.' },
                        { description: 'Respondo las fáciles para asegurar un buen puntaje.' },
                        { description: 'Respondería una mezcla de ambas.' },
                    ],
                },
                {
                    description: 'Te invitan a una excursión sin un plan claro, pero podría ser una experiencia única y emocionante. ¿Te animarías a ir?',
                    answers: [
                        { description: 'Sí, me gusta la aventura.' },
                        { description: 'No, prefiero algo más planificado.' },
                        { description: 'Solo iría si conozco bien el lugar.' },
                    ],
                },
                {
                    description: 'En un casino, tienes la opción de apostar todo tu dinero en un número de la ruleta para ganar 10 veces más, o apostar pequeñas cantidades en apuestas más seguras. ¿Qué harías?',
                    answers: [
                        { description: 'Apuesto todo en el número.' },
                        { description: 'Hago pequeñas apuestas seguras.' },
                        { description: 'No apostaría nada, prefiero no correr riesgos.' },
                    ],
                },
                {
                    description: 'Tienes que elegir entre realizar un proyecto individual que si haces bien te garantiza un sobresaliente, o trabajar en grupo, lo cual es más fácil pero te da una calificación media. ¿Qué harías?',
                    answers: [
                        { description: 'Trabajo solo y corro el riesgo.' },
                        { description: 'Trabajo en grupo para asegurar una nota decente.' },
                        { description: 'Dependería de quiénes estén en el grupo.' },
                    ],
                },
                {
                    description: 'Te ofrecen un trabajo temporal con un salario estable, o la posibilidad de un trabajo a comisión donde podrías ganar mucho más o mucho menos dependiendo de tu rendimiento. ¿Qué prefieres?',
                    answers: [
                        { description: 'El trabajo estable.' },
                        { description: 'El trabajo a comisión, quiero la posibilidad de ganar más.' },
                        { description: 'Quisiera probar ambos antes de decidir.' },
                    ],
                },
                {
                    description: 'En un deporte que te apasiona, puedes elegir jugar un partido contra un equipo fuerte donde puedes ganar o perder por mucho, o un equipo débil que casi seguro ganarás. ¿Qué prefieres?',
                    answers: [
                        { description: 'Jugar contra el equipo fuerte, más emocionante.' },
                        { description: 'Jugar contra el equipo débil para asegurar la victoria.' },
                        { description: 'Jugaría con cualquiera, me adapto.' },
                    ],
                },
                {
                    description: 'En tu comunidad, hay un emprendimiento nuevo. Invertir en él puede llevarte a grandes ganancias, pero también podrías perder tu dinero. ¿Qué harías?',
                    answers: [
                        { description: 'Invierto, el riesgo es parte del negocio.' },
                        { description: 'No invierto, no quiero perder lo que tengo.' },
                        { description: 'Solo invierto si otros ya lo han hecho y les fue bien.' },
                    ],
                },
                {
                    description: 'Tienes que decidir entre estudiar una carrera que te gusta pero es difícil encontrar empleo, o una carrera que no te entusiasma tanto pero tiene mucha demanda laboral. ¿Qué harías?',
                    answers: [
                        { description: 'Estudio lo que me gusta, aunque sea más riesgoso.' },
                        { description: 'Estudio lo que tiene más demanda, prefiero asegurar un trabajo.' },
                        { description: 'Intento encontrar un equilibrio entre ambas opciones.' },
                    ],
                },
            ];

            for (const questionData of economicQuestions) {
                const question = this.questionRepository.create({
                    description: questionData.description,
                    form: savedEconomicForm,
                });
                const savedQuestion = await this.questionRepository.save(question);

                const answers = questionData.answers.map((answer) =>
                    this.answerRepository.create({ description: answer.description, question: savedQuestion }),
                );
                await this.answerRepository.save(answers);
            }

            console.log('Datos de prueba insertados: formularios, preguntas y respuestas.');
        }
    }
}
