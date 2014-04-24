/**
 * Created by ajay on 25/3/14.
 */
/*
 angular.module('numFilters', []).filter('checkmark', function() {
 return function(input) {

 if((input%2==0)){
 return "even"

 }
 else{
 return "odd";

 }

 };
 });*/
var myfilter = angular.module('numFilters', [])
myfilter.filter('count', function () {
    return function (input, type) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>> in filter>>>>>>>>>>>>>>>>>>", input);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>> in filter>>>>>>>>>>>>>>>>>>", type);
        if (input == 1) {
            return input + " " + type
        }
        if (input > 1) {
            return input + " " + type + "s"
        }
        else {
            return "No " + type + "s"
        }
    };
});
myfilter.filter('show5lines', function () {

    return function (input) {


        console.log('show5lines >>> ',input);
    }

});
