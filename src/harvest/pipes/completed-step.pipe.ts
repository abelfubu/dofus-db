import { Injectable, PipeTransform } from '@nestjs/common';
import { HarvestCompleteStepsDto } from 'src/harvest/dtos/harvest-complete-steps.dto';

@Injectable()
export class CompletedStepsPipe implements PipeTransform {
  transform(value: HarvestCompleteStepsDto) {
    return Object.entries(value.steps).reduce<number[]>((acc, [key, value]) => {
      if (value) acc.push(Number(key));
      return acc;
    }, []);
  }
}
