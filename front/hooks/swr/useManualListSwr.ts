import useSWR from "swr";
// const
import { WpGraphQlPostConst } from "../../constants/WpGraphQlConst";
// type
import PostOnListType from "../../types/PostOnListType";
// service
import ManualService from "../../services/ManualService";

// 下記のuseSWRは使い方が特殊なので、注意
// 第1引数：APIのENDPOINT（URL）を使用するケースが多いが、今回はGraphqlを使用しており、一意なもの設定できないため、クエリ文を使用。
// 第2引数：フェッチ関数
// 第3引数：fallbackDataキーに初期値を設定

// ※dataキーの値が更新値なるため、更新値を返す
const useManualListSwr = ({
  currentPage,
  categorySlug,
  staticPostList,
  staticTotal,
}: {
  currentPage: number;
  categorySlug?: string;
  staticPostList: PostOnListType[];
  staticTotal: number;
}) => {
  let key, fetcher;
  key = categorySlug
    ? [WpGraphQlPostConst.manualListBycategory, currentPage, categorySlug]
    : [WpGraphQlPostConst.manualList, currentPage];
  fetcher = categorySlug
    ? () => ManualService.getList({ page: currentPage, categorySlug })
    : () => ManualService.getList({ page: currentPage });
  const { data } = useSWR<[PostOnListType[], number]>(key, fetcher, {
    fallbackData: [staticPostList, staticTotal],
  });
  return data ?? [staticPostList, staticTotal];
};

export default useManualListSwr;
