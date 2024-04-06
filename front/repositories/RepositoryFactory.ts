import PostRepository from "./PostRepository";
import CodeRepository from "./CodeRepository";
import ManualRepository from "./ManualRepository";

const RepositoryFactory = {
  post: PostRepository,
  code: CodeRepository,
  manual: ManualRepository
}

export default RepositoryFactory;