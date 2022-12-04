import { Controller, Post, Body } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { InputDTO } from './dto/graph.dto';

import { GraphInterface } from './interfaces/graph.Interface';


@Controller('graphs')
export class GraphsController {
    constructor(private readonly graphsService: GraphsService) { }

    @Post()
    getTransitions(@Body() body: InputDTO): GraphInterface {
        const { transition, statuses } = body;
        return this.graphsService.getGraphResults(transition, statuses);
    }
}
