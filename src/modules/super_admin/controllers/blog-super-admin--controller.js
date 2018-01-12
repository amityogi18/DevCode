let _this,
    _activePromise;

export class BlogController {
    /** @ngInject  */
    constructor(BlogService, NgTableParams, UtilsService, dataTableService,$state,$timeout) {
        _this = this;        
        _this.UtilsService = UtilsService;
        _this.dataTableService = dataTableService;
        _this.BlogService = BlogService;
         _this.$state = $state;
         _this.$timeout = $timeout;
        _this.isAdd = true;
        _this.isEdit = false;
        _this.isBlogFileAdded = false;
        _this.blogTableFilter = {};
        _this.blogs = {};

        _this.blogTableParams = new NgTableParams(
             {
            page: 1,
            count: 5,
            filter: _this.blogTableFilter
        }, 
             {
                counts: [5, 10, 20],
                getData: function(params) {
                    let filter = params.filter(),
                        sorting = params.sorting(),
                        count = params.count(),
                        page = params.page(),
                        filterFields = [],
                        sortFields = [],
                        queryString = '',
                        queryURL = '?';
                    angular.forEach(sorting, (value, key) => {
                        sortFields.push(`${key}&order=${value}`);
                    });
                    angular.forEach(filter, (value, key) => {
                        filterFields.push(`${key}=${value}`);
                    });
                    if (sortFields.length) {
                        queryString += `orderBy=${sortFields.join('&')}&`;
                    }
                    if (filterFields.length) {
                        queryString += filterFields.join('&');
                    }
                    queryURL += `${queryString}&limit=${count}&page=${page}`;
                    let onSuccess = (response) => {

                             _this.blogList = response.data.data;
                             _this.blogCount = response.data.total;
                            if (_this.blogList && _this.blogList.length > 0) {                              
                                params.total(_this.blogCount);
                                if (!_this.dataTableService.totalColumn.length) {
                                _this.dataTableService.initTable(_this.cols, _this.blogTableParams);
                            }                           
                                return (_this.blogList);
                            }
                            
                        },
                    onError = (error) => {
                        console.log(error);
                    };

                    _this.BlogService.getBlogDetails(queryURL);
                   return  _this.BlogService.activePromise.then(onSuccess, onError);
                }
            });

    }

    checkMandatoryFields() {
        if(_this.blogs.title && _this.blogs.title !== ''
          && _this.blogs.description && _this.blogs.description !== ''
          && _this.blogs.metaTag && _this.blogs.metaTag !== ''
          && _this.blogs.metaTitle && _this.blogs.metaTitle !== ''      
        )
        {   _this.blogForm.$setPristine();
            _this.blogForm.$setUntouched();
          return true;
        }else
        {
          _this.blogForm.$setSubmitted();
          return false;
        }
  }

    uploadFile(file) {       
        _this.blogs.blogImagePath = file[0];
      }

    addBlog() {
       if(_this.checkMandatoryFields()){
            _this.isAdd = true;
            _this.isEdit = false;   
            let onSuccess = () => {
                _this.UtilsService.notify("Blog Added Successfully");
                _this.close();
                _this.$timeout(function(){
                      _this.blogTableParams.reload();
                  },1000);
                  _this.$state.go(_this.$state.current, {}, {reload: true});
            },
            onError = (error) => {
                console.log(error);
            };
            _this.BlogService.addBlog(_this.blogs).then(onSuccess, onError);
        }        
    }

    showUpdateBlogs(data) {
        _this.blogs = {};
        _this.blogs = data;
        _this.isAdd = false;
        _this.isEdit = true;
      }

    updateBlog() {
     if(_this.checkMandatoryFields()){
         let onSuccess = () => {
           _this.UtilsService.notify("Blog Updated Successfully");
            _this.close();
            _this.blogTableParams.reload();
        },
        onError = (error) => {
            console.log(error);
        };
        let blogUpdateData = {
            title: _this.blogs.title,
            description: _this.blogs.description,
            metaTag:_this.blogs.metaTag,
            metaTitle:_this.blogs.metaTitle,
            metaDescription: _this.blogs.metaDescription,
            blogStatus:1,
            blogImagePath: _this.blogs.blogImagePath,
        };
        _this.BlogService.updateBlog(blogUpdateData, _this.blogs.id);
        _this.BlogService.activePromise.then(onSuccess, onError);
    }
  }
           
}