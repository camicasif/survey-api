import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Respondent } from '../respondent/respondent.entity';
import { Career } from '../career/career.entity';

@Injectable()
export class DataInitializer implements OnModuleInit {
    constructor(
        @InjectRepository(Respondent)
        private readonly respondantRepository: Repository<Respondent>,
        @InjectRepository(Career)
        private readonly careerRepository: Repository<Career>,
    ) {}

    async onModuleInit() {
        const careerData = [
            { name: 'Ingeniería Financiera', description: 'Carrera enfocada en la gestión de riesgos financieros, inversiones y el análisis de mercados.' },
            { name: 'Ingeniería Comercial', description: 'Carrera que combina conocimientos de ingeniería y gestión empresarial, enfocada en negocios y comercio.' },
            { name: 'Comunicación', description: 'Carrera centrada en la creación, análisis y gestión de mensajes en diversos medios de comunicación.' },
            { name: 'Marketing', description: 'Carrera que estudia estrategias de mercado para promocionar y vender productos y servicios.' },
            { name: 'Administración de Empresas', description: 'Carrera orientada a la planificación, organización y dirección de recursos empresariales.' },
            { name: 'Ingeniería de Sistemas', description: 'Carrera enfocada en el diseño, desarrollo y mantenimiento de sistemas informáticos y tecnológicos.' },
            { name: 'Ingeniería Industrial', description: 'Carrera que optimiza procesos productivos y mejora la eficiencia en empresas y organizaciones.' },
            { name: 'Ciencia de Datos', description: 'Carrera que aplica métodos estadísticos y algoritmos para la extracción de conocimiento a partir de grandes volúmenes de datos.' },
            { name: 'Economía', description: 'Carrera que analiza la producción, distribución y consumo de bienes y servicios en una sociedad.' },
        ];
        const careers = await this.careerRepository.save(careerData);
        const initialRespondants = [
            {
                ci: 12345678,
                name: 'John',
                surname: 'Doe',
                age: 30,
                career: careers[0],
            },
            {
                ci: 87654321,
                name: 'Jane',
                surname: 'Smith',
                age: 25,
                career: careers[1],
            },
        ];
        await this.respondantRepository.save(initialRespondants);
        console.log('Datos de prueba insertados.');
    }
}
