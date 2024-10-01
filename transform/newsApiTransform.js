class NewsApiTransform{
    static transform(news){
        return {
            id:news.id,
            heading:news.title,
            news:news.content
        }
    }
}

export default NewsApiTransform;