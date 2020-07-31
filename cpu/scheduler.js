function setValue(i){
    var name = $('.opt-'+String(i)).html();
    let temp = name.replace(' ', '-');
    json2['current'] = name;
    $('.algo-choose').html(name);
    $('.algo-form').html('');
    $('.algo-form').append("<form classs='"+temp+" f-1'>");
    let counter = 0;
    for (let key in json[name]['config']){
        $('.algo-form').append(
            "<div class='form-group row'>"+
            "<label for='"+temp+"-option-'"+counter+" class='col-sm-2 col-form-label'>"+key+"</label>"+
            "<div class='col-sm-10'>"+
            "<input type='text' class='form-control' id='"+temp+"-option-"+counter+"' value='"+json[name]['config'][key][0]+"'placeholder='"+json[name]['config'][key][1]+"'>"+
            "</div></div>"
        );
        counter+=1;
    }
    $('.algo-form').append(
        "<button type='submit' class='btn btn-success colo mb-2' onclick='showProcess()'>Create Scheduler</button></form>"
    )
    
}

function showProcess(){
    var name = $('.algo-choose').html();
    counter = 0
    for (let key in json[name]['config']){
        let val = $('#'+name.replace(' ','-')+'-option-'+counter).val();
        console.log(val);
        json2[name]['config'][key][0] = val;
        counter+=1;
    }
    $('.part-1').hide();
    $('.part-2').show();
  
    display_tcb();   
}

function set_process_id(){
    let name = $('.algo-choose').html();
    $('#'+name.replace(' ','-')+'-Id').val('P_'+ Math.floor((Math.random() * 100)));
}

function display_tcb(){
    var name = $('.algo-choose').html();
    for (let i=0;i<json[name]['TCB'].length;i++){
        $('.TCB').append(
            "<div class='form-group'>"+
            "<label for='"+name.replace(' ', '-')+"-"+json[name]['TCB'][i]+"'>"+json[name]['TCB'][i]+"</label>"+
            "<input type='text' class='form-control-plaintext' id='"+name.replace(' ', '-')+"-"+json[name]['TCB'][i]+"' placeholder='Enter a value'>"+
            "</div>"
        );
    }
    $('.TCB').append(
        "<a class='btn btn-success colo' onclick='createProcess()'>Create</a>"
    )
    set_process_id();
}
function createProcess(){
    let name = $('.algo-choose').html();
    let temp= name.replace(' ', '-');
    $('.empty-process-list').hide();
    let process_temp = [];
    let temp2= ''
    temp2 += "<div class='card w-100'>"+
        "<div class='card-body' style='text-align: justify;'>";
    for(let i=0;i<json[name]['TCB'].length;i++){
        temp2+="<h6 class='card-title'>"+json[name]['TCB'][i]+" : "+$('#'+temp+'-'+json[name]['TCB'][i]).val()+"</h6>";
        if(i==0){
        process_temp.push($('#'+temp+'-'+json[name]['TCB'][i]).val());}
        else{
            process_temp.push(Number($('#'+temp+'-'+json[name]['TCB'][i]).val()));
        }

    }
    temp2+= "<a class='card-link' href='#' onclick='remove(this)'>Remove</a>"+
            "</div>"+
        "</div><br>";
    $('.process-list').prepend(temp2)
    json2[name]['Process_list'].push(process_temp);
    set_process_id();
    console.log(json2);
}

function remove(child){
    child.parentNode.parentNode.parentNode.removeChild(child.parentNode.parentNode);
    let len = json2[$('.algo-choose').html()]['Process_list'];
    json2[$('.algo-choose').html()]['Process_list'].splice(len-1, 1);
}

function calc_ideal_u(n){
    return n*(Math.pow(2, 1/n)-1);
}

function current_u(p_list){
    let summ = 0;
    for(let i=0;i<p_list.length;i++){
        summ+=(p_list[i][2]/p_list[i][1]);
    }
    return summ;
}

const gcd = (a, b) => a ? gcd(b % a, a) : b;

const lcm = (a, b) => a * b / gcd(a, b);

function calc_lcm_list(p_list){
    let p_temp = []
    for(let i = 0;i<p_list.length;i++){
        p_temp.push(p_list[i][1]);
    }
    let a = p_temp.reduce(lcm);
    console.log(a);
    return a;

}

var flag = 0;

function submit_process(){
    
    let name = $('.algo-choose').html();
    if(name=='Round Robin'){
        flag = 0;
    }
    if(name=='Rate Monotonic'){
        if(current_u(json2[name]['Process_list'])>=calc_ideal_u(json2[name]['Process_list'].length)){
            $('.process-list').prepend('<h5 style="color: #fff;">The CPU utilization is not schedulable and wont be able to complete in deadline, change the process values</h5>');
            flag = 1;
        }
        else{
            $('.process-list').prepend('<h5 style="color:#fff;">These processes are schedulable with a combined period of '+ calc_lcm_list(json2[name]['Process_list'])+'</h5>');
            json2[name]['config']['Current Utilization'][0] = current_u(json2[name]['Process_list']);
            json2['Rate Monotonic']['config']['Combined Period'][0] = calc_lcm_list(json2[name]['Process_list']);
            flag = 0;
        }
    }
    if(name=='Earliest Deadline'){
        if(current_u(json2[name]['Process_list'])>=1){
            $('.process-list').prepend('<h5 style="color: #fff;">The CPU utilization is not schedulable and wont be able to complete in deadline, change the process values</h5>');
            flag = 1;
        }else{
            $('.process-list').prepend('<h5 style="color:#fff;">These processes are schedulable with a combined period of '+ calc_lcm_list(json2[name]['Process_list'])+'</h5>');
            json2[name]['config']['Current Utilization'][0] = current_u(json2[name]['Process_list']);
            json2[name]['config']['Combined Period'][0] = calc_lcm_list(json2[name]['Process_list']);
            flag = 0;
        }
    }
    if(flag==0){
        json2['waiting'] = json2[name]['Process_list'];
        strr = ''
        strr+='<li class="list-group-item">Algorithm :'+name+'</li>';
        for(let key in json2[name]['config']){                            
            strr+='<li class="list-group-item">'+key+':'+json2[name]['config'][key][0]+'</li>'
        }
        strr+='<li class="list-group-item counter">Internal Counter: 0</li>' 
        $('.algo-conf').append(
                strr
        )
        strr = ''
        strr+='<tr>'
        strr+='<th scope="col">no.</th>'
        for(let va=0;va<json2[name]['TCB'].length;va++){
            strr+='<th scope="col">'+json2[name]['TCB'][va]+'</th>';
        }
        strr+='</tr>'
        $('.waiting-header').append(strr);
        let len = json2['waiting'].length
        for(let va=0;va<len;va++){
            strr=''
            strr+='<tr>'
            strr+='<td scope="row">'+va+'</td>'
            for(let va2=0;va2<json2['waiting'][va].length;va2++){
                strr+='<td>'+json2['waiting'][va][va2]+'</td>';
            }
            strr+='</tr>';
            $('.waiting-process').append(strr);
        }
        $('.part-1').hide();
        $('.part-2').hide();
        if(name=='Rate Monotonic'){
            $('.add-process').hide();
        }
        if(name=='Earliest Deadline'){
            $('.wait-change').html('Deadline');
            $('.wait-change-2').html('Deadline');
        }
        $('.part-3').show();
    }

}
var counter2 = 0;
var interval;
function start_timer(){
    interval = setInterval(
        function(){
            $('.counter').html('Internal Counter: '+counter2);
            execute_one();
            counter2+=1;
        }, 1500);
}
function stop_timer(){
    clearInterval(interval);
}
function execute_one(){
    let name = $('.algo-choose').html();
    if(name=='Round Robin'){
        round_robin();
    }
    else if(name=='Rate Monotonic'){
        rate_monotonic();
    }
    else if(name=='Earliest Deadline'){
        earliest_deadline_first();
    }
}
var posn = 0;
var wait_flag = 0;
var temp_state = 0;
function round_robin(){
    console.log(temp_state);
    // push processes to ready queue  
    for(let i=0;i<json2['waiting'].length;i++){
        if(json['waiting'][i][1]<=counter2){
        temp_arr = [];
        for(var j=0;j<7;j++){
            if(j>=3){
                temp_arr.push(0);
            }
            else{
                temp_arr.push(json['waiting'][i][j]);
            }
        }
        temp_arr.push('#' + parseInt(Math.random() * 0xffffff).toString(16));
        json2['ready'].push(temp_arr);
        
        } 
    }
    display_json_ready(json2['ready'][posn]);
    let i = 0;
    while(1){
        if(i==json2['waiting'].length){
            break
        }
        if(json2['waiting'][i][1]<=counter2){
            json2['waiting'].splice(i, 1);
        }
        else{
            i+=1;
        }

    }
    display_json_waiting();
    if(json2['ready'].length>0){
        // context switch and chosing which process to execute
        let temp_ar = json2['ready'][posn]==undefined;
        if(counter2!=0 && temp_state!=0 && (temp_state%(Number(json2['Round Robin']['config']['Time Slice'][0]))==0 || json2['ready'][posn][3]==json2['ready'][posn][2])){
            posn+=1
            if(posn>=json2['ready'].length){
                posn=0;
            }
            if(posn!=0){
                // setting waiting time for processes
                json2['ready'][posn][5]=counter2-json2['ready'][posn][1]-1;
            }
            temp_state = 0;
            do_context_switch();
            
        }
        else{
            json2['ready'][posn][3]+=1;
            temp_state+=1;
            $('.posn-'+posn).css('background-color', json2['ready'][posn][7]);
            $('.posn-'+posn).css('color', '#ffffff');
            $('#textarea').append('Time: '+counter2+' Process: '+ json2['ready'][posn][0])
            $('#textarea').append('\n');
            if(json2['ready'][posn][3]==json2['ready'][posn][2]){
                json2['ready'][posn][6]=counter2;
                json2['suspended'].push(json2['ready'][posn]);
                json2['ready'].splice(posn, 1);
                posn-=1;
                if(json2['ready'].length===0 && json2['waiting'].length===0){
                    display_json_ready(json2['ready'][posn]);
                    display_json_suspended(json2['ready'][posn]);
                    finish_execution();
                }
                display_json_suspended(json2['ready'][posn]);
            }
        }
        
    }

}

function custom_compare(a, b){
    if(a[4]<b[4]){
        return -1;
    }
    if(a[4]>b[4]){
        return 1;
    }
    return 0;
}

function sort_p_list(){
    let temp = json2['ready'].slice();
    temp.sort(custom_compare);
    return temp;
}
function rate_monotonic(){
    // push all the processes at the start
    if(counter2==0){
        for(let i=0;i<json2['waiting'].length;i++){
            temp_arr = [];
            for(var j=0;j<7;j++){
                temp_arr.push(0);
            }
            temp_arr[0] = json2['waiting'][i][0];
            temp_arr[4] = json2['waiting'][i][1];
            temp_arr[2] = json2['waiting'][i][2];
            temp_arr.push('#' + parseInt(Math.random() * 0xffffff).toString(16));
            json2['ready'].push(temp_arr);
        }
        json2['waiting'] = [];
    }
    else{
        display_json_waiting();
        // if any suspended processes period is up add them back to ready
        if(json2['suspended'].length!=0){
            let i = 0;
            while(1){
                if(i==json2['suspended'].length){

                    break
                }
                if(counter2%json2['suspended'][i][4]==0){
                    let temp = json2['suspended'][i];
                    json2['ready'].push(temp);
                    json2['suspended'].splice(i, 1);
                }
                else{
                    i+=1;
                }
            }
        }
        if(json2['ready'].length==0){
            //  idle time
            console.log('idle');
            $('#textarea').append('Time: '+counter2+' Process: Idle');
            $('#textarea').append('\n');
        }
        else{
            if(json2['ready'][0][3]==json2['ready'][0][2]){
                json2['ready'][0][3] = 0;
                json2['suspended'].push(json2['ready'][0]);
                json2['ready'].splice(0, 1);
            }
            if(json2['ready'].length!=0){
                json2['ready'] = sort_p_list(json2['ready']);
                $('#textarea').append('Time: '+counter2+' Process: '+ json2['ready'][0][0]);
                $('#textarea').append('\n');
                json2['ready'][0][3]+=1;
            }
        }
        display_json_ready(json2['ready'][0]);
        display_json_suspended();
        if(json2['ready'][0]!=undefined){
            $('.posn-0').css('background-color', json2['ready'][0][7]);
        }else{
            $('.posn-0').css('background-color', '#fff');
        }
        $('.posn-0').css('color', '#ffffff');
    }
}

function custom_compare2(a, b){
    if(a[5]<b[5]){
        return -1;
    }
    if(a[5]>b[5]){
        return 1;
    }
    return 0;
}

function sort_p_list2(){
    let temp = json2['ready'].slice();
    temp.sort(custom_compare2);
    return temp;
}
function earliest_deadline_first(){
    // push all the processes at the start
    if(counter2==0){
        for(let i=0;i<json2['waiting'].length;i++){
            temp_arr = [];
            for(var j=0;j<7;j++){
                temp_arr.push(0);
            }
            temp_arr[0] = json2['waiting'][i][0];
            temp_arr[4] = json2['waiting'][i][1];
            temp_arr[2] = json2['waiting'][i][2];
            temp_arr[5] = counter2+json2['waiting'][i][1];
            temp_arr.push('#' + parseInt(Math.random() * 0xffffff).toString(16));
            json2['ready'].push(temp_arr);
        }
        json2['waiting'] = [];
    }
    else{
        display_json_waiting();
        // if any suspended processes period is up add them back to ready
        if(json2['suspended'].length!=0){
            let i = 0;
            while(1){
                if(i==json2['suspended'].length){

                    break
                }
                if(counter2%json2['suspended'][i][4]==0){
                    let temp = json2['suspended'][i];
                    temp['5'] = counter2+temp['4'];
                    json2['ready'].push(temp);
                    json2['suspended'].splice(i, 1);
                }
                else{
                    i+=1;
                }
            }
        }
        if(json2['ready'].length==0){
            //  idle time
            console.log('idle');
            $('#textarea').append('Time: '+counter2+' Process: Idle');
            $('#textarea').append('\n');
        }
        else{
            if(json2['ready'][0][3]==json2['ready'][0][2]){
                console.log('came here');
                json2['ready'][0][3] = 0;
                json2['suspended'].push(json2['ready'][0]);
                json2['ready'].splice(0, 1);
            }
            console.log('suspended '+json2['suspended'].toString() );
            if(json2['ready'].length!=0){
                json2['ready'] = sort_p_list2(json2['ready']);
                console.log('ready '+json2['ready'].toString() );
                if(json2['ready'].length>=2){
                    let temp_counter = 1;
                    while(json2['ready'][temp_counter][5]==json2['ready'][0][5] && json2['ready'][0][3]==0){
                        console.log(temp_counter+' '+json2['ready'][temp_counter])
                        temp_counter+=1
                        if(temp_counter>=json2['ready'].length){
                            break;
                        }
                    }
                    let temp_pos = Math.floor(Math.random() * temp_counter);
                    if(temp_pos!=0){
                        let tempp = json2['ready'][0];
                        json2['ready'][0] = json2['ready'][temp_pos];
                        json2['ready'][temp_pos] = tempp;
                        display_json_ready();
                    }
                }
                $('#textarea').append('Time: '+counter2+' Process: '+ json2['ready'][posn][0]);
                $('#textarea').append('\n');
                json2['ready'][0][3]+=1;
            }
        }
        display_json_ready();
        display_json_suspended();
        if(json2['ready'][0]!=undefined){
            $('.posn-0').css('background-color', json2['ready'][0][7]);
        }else{
            $('.posn-0').css('background-color', '#fff');
        }
        $('.posn-0').css('color', '#ffffff');
    }
}


function finish_execution(){
    stop_timer();
}

function display_json_ready(ele){
    $('.ready-q').html('');
    for(let i = 0;i<json2['ready'].length;i++){
        let str = '';
        str+='<tr class=posn-'+i+'>';
        for (let j = 0; j<json2['ready'][i].length-1;j++){
            str+='<td>'+json2['ready'][i][j]+'</td>';
        }
        str+='</tr>'; 
        $('.ready-q').append(str);
    }
    console.log(json2['ready'][posn]);
    if(ele!=undefined){
    $('.progress-bar').css('background-color', ele[7]);    
    $('.progress-bar').width(Math.floor(ele[3]/ele[2]*100)+'%');
    }
}

function display_json_suspended(ele){
    $('.suspended-q').html('');
    for(let i = 0;i<json2['suspended'].length;i++){
        let str = '';
        str+='<tr>';
        for (let j = 0; j<json2['suspended'][i].length-1;j++){
            str+='<td>'+json2['suspended'][i][j]+'</td>';
        }
        str+='</tr>'; 
        $('.suspended-q').append(str);
    }
    if(ele!=undefined){
    $('.progress-bar').css('background-color', ele[7]);
    $('.progress-bar').width(Math.floor(ele[3]/ele[2]*100)+'%');
    }
}


function display_json_waiting(){
    $('.waiting-process').html('');
    for(let i = 0;i<json2['waiting'].length;i++){
        let str = '';
        str+='<tr>';
        str+='<td scope="row">'+i+'</td>'
        for (let j = 0; j<json2['waiting'][i].length;j++){
            str+='<td>'+json2['waiting'][i][j]+'</td>';
        }
        str+='</tr>'; 
        $('.waiting-process').append(str);
    }
}

function do_context_switch(){
    $('#textarea').append('Time : '+ counter2+' Context_switch');
    $('#textarea').append('\n');
    
}