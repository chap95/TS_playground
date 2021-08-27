interface ISample {
  title: string;
  content: string;
}

function updateSample(sample: ISample, fieldsToUpdate: Partial<ISample>) {
  return { ...sample, ...fieldsToUpdate };
}

const proto: ISample = {
  title: "원형 입니다.",
  content: "내용을 적어주세요",
};

const sample1 = updateSample(proto, {
  content: "sample 입니다.",
});

// ----------

interface IBook {
  title: string;
  info: string;
}

interface IAuthor {
  name: string;
  homeTown: string;
}

type BookInfo = IBook & IAuthor;
type AuthorInfo = IAuthor & Partial<IBook>;

const book1: BookInfo = {
  title: "책 1",
  info: "1번 책입니다.",
  name: "김작가",
  homeTown: "강원도",
};

const author1: AuthorInfo = {
  name: "신인작가",
  homeTown: "서울",
};
