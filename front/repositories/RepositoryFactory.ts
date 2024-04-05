import PostRepository from "./PostRepository";
import CodeRepository from "./CodeRepository";

const RepositoryFactory = {
  post: PostRepository,
  code: CodeRepository
}

export default RepositoryFactory;