from functools import lru_cache

import aioinject

# from app.audit_logs.repositories import AuditLogRepo
# from app.database.dependencies import get_session
# from app.questions.repositories import AnswerRepo, QuestionRepo, QuestionVoteRepo
# from app.questions.services import AnswerService, QuestionService
# from app.users.repositories import UserRepo


@lru_cache
def create_container() -> aioinject.Container:
    container = aioinject.Container()
    # container.register(aioinject.Scoped(get_session))
    # container.register(aioinject.Scoped(QuestionRepo))
    # container.register(aioinject.Scoped(QuestionService))
    # container.register(aioinject.Scoped(QuestionVoteRepo))
    # container.register(aioinject.Scoped(AnswerRepo))
    # container.register(aioinject.Scoped(AnswerService))
    # container.register(aioinject.Scoped(UserRepo))
    # container.register(aioinject.Scoped(AuditLogRepo))
    return container
