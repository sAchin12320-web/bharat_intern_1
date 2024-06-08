const express = require('express');
const Article = require('./../models/article');
const router = express.Router();


router.get('/new',(req,res)=>{
    res.render("article/new",{article: new Article()})
})

router.get('/edit/:id',async (req,res)=>{
    const article = await Article.findById(req.params.id)
    res.render('article/edit',{article: article})
})

router.get('/:id',async(req,res)=>{
    // const article = await Article.findOne({slug:req.params.slug})
    const article = await Article.findById(req.params.id)
    if(article===null)res.redirect('/')
    res.render(`article/show`,{article:article})
})

router.delete('/:id',async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

router.put('/:id',async(req,res,next)=>{
     req.article = await Article.findById(req.params.id)
     next()
},saveArticle('edit'))

router.post('/',async(req,res,next)=>{
    req.article=new Article()
    next()
},saveArticle('new'))



function saveArticle(path){
    return async(req,res)=>{
    let article = req.article
    article.title=req.body.title
    article.description=req.body.description
    article.markdown=req.body.markdown
    
    try{
    article = await article.save()
    res.redirect(`/article/${article.id}`)
    }
    catch(error){
        res.render(`article/${path}`,{article:article})
    }
}
}
module.exports = router