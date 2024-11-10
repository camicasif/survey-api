import {Controller, Get} from '@nestjs/common';

@Controller('survey')
export class SurveyController {

    private surveys = [{title: "Encuesta #1"}];
    @Get()
    getAllSurveys() {
        return this.surveys;
    }
}
