import useSWR from "swr";
// const
import { WpGraphQlPostConst } from "../../constants/WpGraphQlConst";
// type
import PostType from "../../types/PostType";
// service
import CodeService from "../../services/CodeService";

// 下記のuseSWRは使い方が特殊なので、注意
// 第1引数：APIのENDPOINT（URL）を使用するケースが多いが、今回はGraphqlを使用しており、一意なもの設定できないため、クエリ文を使用。
// 第2引数：フェッチ関数
// 第3引数：fallbackDataキーに初期値を設定

// ※dataキーの値が更新値なるため、更新値を返す
const usePostSwr = ({
  id,
  staticPost,
}: {
  id: string;
  staticPost: PostType;
}) => {
  const { data: post } = useSWR(
    [WpGraphQlPostConst.one, id],
    () => CodeService.getOne({ id }),
    { fallbackData: staticPost }
  );
  return post;
};

export default usePostSwr;
