import { Request, Response, NextFunction } from 'express'

import { UnauthorizedException } from '../../../../libs/exceptions/unauthorized-exception'
import { Syllabus } from '../../domain/syllabus'
import { SyllabusQueryParamsHttpRequest } from './find-syllabi-dto'
import { FindSyllabiService } from './find-syllabi-service'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FindSyllabiController = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.acceptedPolicies) {
    const error = new UnauthorizedException()
    res.status(error.code)
    return res.json(error)
  }

  const userId = req.user.id

  // Note: this object doesn't introduce external data so there is no need to validate it by now
  const queryParams = new SyllabusQueryParamsHttpRequest({ owner: userId })

  let response: Syllabus[] | unknown
  try {
    response = await FindSyllabiService.execute(queryParams)
  } catch (error) {
    // TODO: update res.status when we start to use our internal exceptions
    response = error
    // TODO: implemente new log system
    // eslint-disable-next-line no-console
    console.log(error)
  }

  return res.json(response)
}
